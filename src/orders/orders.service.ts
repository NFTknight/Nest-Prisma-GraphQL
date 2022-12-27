import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryMethods, Order, OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/cart.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ORDER_OPTIONS, SendEmails } from 'src/utils/email';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { OrdersFilterInput } from 'src/common/filter/filter.input';
import { WayBill } from 'src/shipping/models/waybill.model';
import { ShippingService } from 'src/shipping/shipping.service';

import { CreateOrderInput } from './dto/create-order.input';
import {
  CreateShipmentInput,
  UpdateOrderInput,
} from './dto/update-order.input';
import { FormResponse } from './models/order.model';
import { Cart } from 'src/cart/models/cart.model';
import { ProductsService } from 'src/products/services/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly cartService: CartService,
    private readonly emailService: SendgridService,
    private readonly prisma: PrismaService,
    private readonly shippingService: ShippingService,
    private readonly vendorService: VendorsService,
    private readonly productsService: ProductsService
  ) {}

  async getOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) throw new NotFoundException('Order Not Found.');

    return order;
  }

  async getOrders(
    vendorId: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder,
    filter?: OrdersFilterInput
  ) {
    try {
      const { skip, take } = getPaginationArgs(pg);

      let orderBy = {};
      if (sortOrder) {
        orderBy[sortOrder.field] = sortOrder.direction;
      } else {
        orderBy = { id: 'asc' };
      }

      const where = {
        vendorId,
      };

      if (filter && filter?.field) {
        where[filter.field] = filter.title.trim();
      }
      return await this.prisma.order.findMany({ where, skip, take, orderBy });
    } catch (err) {
      console.log('Err => ', err);
    }
  }

  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    let vendor: Vendor | null = null;
    if (data.vendorId) {
      // if the vendor does not exist, this function will throw an error.
      vendor = await this.vendorService.getVendor(data.vendorId);
    }

    let cartItem: Cart | null = null;

    const order = await this.getOrder(id);
    let wayBillData: WayBill = null;
    const { vendorId, customerInfo } = order;

    if (
      order.status === OrderStatus.PENDING &&
      order.deliveryMethod === DeliveryMethods.SMSA &&
      !order.wayBill
    ) {
      const vendorData = await this.vendorService.getVendor(vendorId);

      const WayBillRequestObject: CreateShipmentInput = {
        ConsigneeAddress: {
          ContactName: `${customerInfo?.firstName || ''} ${
            customerInfo?.lastName || ''
          }`,
          ContactPhoneNumber: customerInfo.phone,
          Country: 'SA',
          City: 'Jeddah',
          AddressLine1: customerInfo?.address || 'Ar Rawdah, Jeddah 23434',
        },
        ShipperAddress: {
          ContactName: vendorData.name || 'Company Name',
          ContactPhoneNumber: vendorData.info.phone || '06012312312',
          Country: 'SA',
          City: 'Riyadh',
          AddressLine1: vendorData.info.address || 'Ar Rawdah, Jeddah 23434',
        },
        OrderNumber: order?.orderId,
        DeclaredValue: 10,
        CODAmount: 30,
        Parcels: 1,
        ShipDate: new Date().toISOString(),
        ShipmentCurrency: 'SAR',
        Weight: 15,
        WeightUnit: 'KG',
        ContentDescription: 'Shipment contents description',
      };

      wayBillData = await this.shippingService.createShipment(
        WayBillRequestObject
      );
    }

    if (order.cartId && order.status === OrderStatus.PENDING) {
      // if the order does not exist, this function will throw an error.
      cartItem = await this.cartService.getCartAndDelete(order.cartId);
    }
    const cartObject = {
      finalPrice: cartItem?.finalPrice || 0,
      totalPrice: cartItem?.totalPrice || 0,
      items: cartItem?.items,
      appliedCoupon: cartItem?.appliedCoupon,
    };

    let updatingOrderObject: any = data;
    if (cartItem?.finalPrice) {
      updatingOrderObject = { ...updatingOrderObject, ...cartObject };
    }
    if (wayBillData?.sawb) {
      updatingOrderObject = { ...updatingOrderObject, wayBill: wayBillData };
    }

    const res = await this.prisma.order.update({
      where: { id },
      data: { ...updatingOrderObject, updatedAt: new Date() },
    });

    // Email notification to vendor and customer if order is confirmed or rejected
    if (
      res.id &&
      (data.status === OrderStatus.CONFIRMED ||
        data.status === OrderStatus.REJECTED)
    ) {
      // Email notification
      this.emailService.send(SendEmails(data.status, res.customerInfo.email));
      if (vendor?.info?.email)
        this.emailService.send(SendEmails(data.status, vendor.info.email));
    }

    // if order is rejected delete all bookings otherwise update the status to PENDING OR CONFIRMED
    if (res.id) {
      if (data.status === OrderStatus.REJECTED) {
        await this.prisma.booking.deleteMany({ where: { orderId: res.id } });
      } else if (
        data.status === OrderStatus.PENDING ||
        data.status === OrderStatus.CONFIRMED
      ) {
        await this.prisma.booking.updateMany({
          where: { orderId: res.id },
          data: {
            status: data.status,
          },
        });
        //delete cart if customer Order is pending.
        if (data.status === OrderStatus.PENDING)
          this.prisma.cart.delete({ where: { id: res.cartId } });
      }
    }

    await this.productsService.updateProductVariantQuantities(
      cartItem?.items || []
    );

    return { ...res, ...updatingOrderObject, updatedAt: new Date() };
  }

  async deleteOrder(id: string): Promise<Order> {
    return await this.prisma.order.delete({ where: { id } });
  }
}
