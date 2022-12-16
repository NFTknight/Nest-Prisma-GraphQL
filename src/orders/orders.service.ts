import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryMethods, Order, OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/services/cart.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ORDER_OPTIONS, SendEmails } from 'src/utils/email';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { OrdersFilterInput } from 'src/common/filter/filter.input';
// import { SHIPPING_CONSTANT } from 'src/constant/shipping';
// import { ShippingConfig } from 'src/common/configs/config.interface';
// import axios from 'axios';
import { WayBill } from 'src/shipping/models/waybill.model';
// import { ShippingService } from 'src/shipping/shipping.service';
@Injectable()
export class OrdersService {
  constructor(
    // private readonly shippingConfig: ShippingConfig,
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly vendorService: VendorsService,
    private readonly emailService: SendgridService // private readonly shippingService: ShippingService
  ) {}

  async getOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) throw new NotFoundException('Order Not Found.');

    return order;
  }

  async getOrders(
    vendorId: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder,
    filter?: OrdersFilterInput
  ): Promise<Order[]> {
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

  async createOrder(data: CreateOrderInput): Promise<Order> {
    // if the vendor does not exist, this function will throw an error.
    await this.cartService.getCart(data.cartId);
    const vendor = await this.vendorService.getVendor(data.vendorId);

    // get order ID from vendor
    let orderId = '';
    const vendorStrArr = vendor.name.split(' ');
    if (vendorStrArr.length === 1) {
      orderId = vendor.name.slice(0, 2).toUpperCase();
    } else if (vendorStrArr.length === 2) {
      orderId = vendorStrArr[0][0] + vendorStrArr[1][0];
    } else {
      orderId = vendorStrArr[0][0] + vendorStrArr[vendorStrArr.length - 1][0];
    }
    orderId = orderId + '-' + Math.random().toString(36).substring(2, 10);

    const newData = { ...data, orderId };

    // if vendor and cart exists we can successfully create the order.
    const res = await this.prisma.order.create({ data: newData });

    // Email notification to vendor and customer when order is created
    if (res.id) {
      this.emailService.send(
        SendEmails(ORDER_OPTIONS.PURCHASED, res?.customerInfo?.email)
      );
      if (vendor?.info?.email)
        this.emailService.send(
          SendEmails(ORDER_OPTIONS.RECEIVED, vendor?.info?.email)
        );
    }

    return res;
  }

  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    let vendor: Vendor | null = null;
    if (data.vendorId) {
      // if the vendor does not exist, this function will throw an error.
      vendor = await this.vendorService.getVendor(data.vendorId);
    }
    if (data.cartId) {
      // if the order does not exist, this function will throw an error.
      await this.cartService.getCart(data.cartId);
    }

    const order = await this.getOrder(id);
    let wayBillResponse: WayBill = null;
    if (
      order.status === OrderStatus.PENDING &&
      order.deliveryMethod === DeliveryMethods.SMSA
    ) {
      // const url = `${this.shippingConfig.url}/api/shipment/b2c/new`;
      // wayBillResponse = await axios({
      //   method: 'post',
      //   url: url,
      //   data: SHIPPING_CONSTANT,
      // });
      //adding dummy data for now as we need Shipping detail of customer.
      wayBillResponse = {
        sawb: '231200021000',
        createDate: '2021-01-01T10:40:53',
        shipmentParcelsCount: 1,
        waybills: [
          {
            awb: '231200021879',
            awbFile: 'JVBERi0xLjQKJeLjz9MKMSA...',
          },
        ],
      };
    }

    const res = await this.prisma.order.update({
      where: { id },
      data: wayBillResponse.sawb
        ? { ...data, wayBill: wayBillResponse, updatedAt: new Date() }
        : { ...data, updatedAt: new Date() },
    });

    // Email notification to vendor and customer if order is confirmed or rejected
    if (
      res.id &&
      (data.status === OrderStatus.CONFIRMED ||
        data.status === OrderStatus.REJECTED)
    ) {
      this.emailService.send(SendEmails(data.status, res.customerInfo.email));
      if (vendor?.info?.email)
        this.emailService.send(SendEmails(data.status, vendor.info.email));
    }

    return res;
  }

  async deleteOrder(id: string): Promise<Order> {
    return await this.prisma.order.delete({ where: { id } });
  }
}
