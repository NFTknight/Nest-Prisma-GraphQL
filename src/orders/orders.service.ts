import { Injectable } from '@nestjs/common';
import {
  DeliveryMethods,
  Order,
  OrderStatus,
  Prisma,
  ProductType,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/cart.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { SendEmails } from 'src/utils/email';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { OrdersFilterInput } from 'src/common/filter/filter.input';
import { WayBill } from 'src/shipping/models/waybill.model';
import { ShippingService } from 'src/shipping/shipping.service';

import {
  CreateShipmentInput,
  UpdateOrderInput,
} from './dto/update-order.input';
import { Cart } from 'src/cart/models/cart.model';
import { PaginatedOrders } from './models/paginated-orders.model';
import { ProductsService } from 'src/products/services/products.service';
import { throwNotFoundException } from 'src/utils/validation';

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
    if (!id) return null;
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    throwNotFoundException(order, 'Order');

    return order;
  }

  async getOrders(
    vendorId: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder,
    filter?: OrdersFilterInput
  ): Promise<PaginatedOrders> {
    try {
      const { skip, take } = getPaginationArgs(pg);

      let orderBy = {};

      let where: Prisma.OrderWhereInput = {
        vendorId,
      };

      if (sortOrder) {
        orderBy[sortOrder.field] = sortOrder.direction;
      } else {
        orderBy = { id: 'asc' };
      }

      if (filter) {
        const { firstName, lastName, phone, email, ...restFilters } = filter;
        where = { ...where, ...restFilters };

        if (firstName || lastName || phone || email) {
          where = {
            ...where,
            customerInfo: {
              is: {
                firstName,
                lastName,
                phone,
                email,
              },
            },
          };
        }
      }

      const res = await this.prisma.$transaction([
        this.prisma.order.count({ where }),
        this.prisma.order.findMany({
          where,
          skip,
          take: take || undefined,
          orderBy,
        }),
      ]);

      throwNotFoundException(res, '', 'Data not found!');

      return { totalCount: res[0], list: res[1] };
    } catch (err) {
      console.log('Err => ', err);
      throw new Error(err);
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
    const { vendorId } = order;
    const vendorData = await this.vendorService.getVendor(vendorId);

    if (order.cartId && order.status === OrderStatus.PENDING) {
      // if the order does not exist, this function will throw an error.
      cartItem = await this.cartService.getCartAndDelete(order.cartId);
    }

    if (
      order.cartId &&
      order.status === OrderStatus.PENDING &&
      order.deliveryMethod === DeliveryMethods.SMSA &&
      !order.wayBill
    ) {
      const WayBillRequestObject: CreateShipmentInput = {
        ConsigneeAddress: {
          ContactName: cartItem.consigneeAddress?.contactName,
          ContactPhoneNumber: cartItem.consigneeAddress?.contactPhoneNumber,
          //this is hardcoded for now
          Country: 'SA',
          City: cartItem.consigneeAddress?.city,
          AddressLine1: cartItem.consigneeAddress?.addressLine1,
        },
        ShipperAddress: {
          ContactName: vendorData.name || 'Company Name',
          ContactPhoneNumber: vendorData?.info?.phone || '06012312312',
          Country: 'SA',
          City: 'Riyadh',
          AddressLine1: vendorData?.info?.address || 'Ar Rawdah, Jeddah 23434',
        },
        OrderNumber: order?.orderId,
        DeclaredValue: 10,
        CODAmount: 30,
        Parcels: 1,
        ShipDate: new Date().toISOString(),
        ShipmentCurrency: 'SAR',
        Weight: 15,
        WaybillType: 'PDF',
        WeightUnit: 'KG',
        ContentDescription: 'Shipment contents description',
      };

      wayBillData = await this.shippingService.createShipment(
        WayBillRequestObject
      );
    }
    const cartObject = {
      finalPrice: cartItem?.finalPrice || 0,
      totalPrice: cartItem?.totalPrice || 0,
      items: cartItem?.items,
      appliedCoupon: cartItem?.appliedCoupon,
      consigneeAddress: cartItem?.consigneeAddress || null,
      shipperAddress: cartItem?.shipperAddress || null,
    };
    let updatingOrderObject: any = data;

    if (cartItem && Object.keys(cartItem).length) {
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
      if (vendorData?.info?.email) {
        this.emailService.send(SendEmails(data.status, vendorData.info.email));
      } else {
        // if vendor info doesn't have email
        const user = await this.prisma.user.findUnique({
          where: { id: vendorData?.ownerId },
        });
        if (user) this.emailService.send(SendEmails(data.status, user.email));
      }
    }

    // if order is rejected delete all bookings otherwise update the status to PENDING OR CONFIRMED
    if (res.id) {
      if (data.status === OrderStatus.REJECTED) {
        await this.prisma.booking.deleteMany({ where: { orderId: res.id } });
        for (const [i, item] of order.items.entries()) {
          console.log({ item });
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (product.type === ProductType.WORKSHOP) {
            await this.prisma.product.update({
              where: { id: product.id },
              data: {
                bookedSeats: product.bookedSeats - item.quantity,
              },
            });
          }
        }
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
        for (const [i, item] of order.items.entries()) {
          console.log({ item });
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (product.type === ProductType.WORKSHOP) {
            await this.prisma.product.update({
              where: { id: product.id },
              data: {
                bookedSeats: {
                  increment: item.quantity,
                },
              },
            });
          }
        }
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
