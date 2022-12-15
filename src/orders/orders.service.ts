import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/services/cart.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ORDER_OPTIONS, SendEmails } from 'src/utils/email';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly vendorService: VendorsService,
    private readonly emailService: SendgridService
  ) {}

  async getOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });
    console.log(JSON.stringify(order));
    if (!order) throw new NotFoundException('Order Not Found.');

    return order;
  }

  async getOrders(vendorId: string): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({ where: { vendorId } });
    } catch (err) {
      console.log('Err => ', err);
    }
  }

  async createOrder(data: CreateOrderInput): Promise<Order> {
    // if the vendor does not exist, this function will throw an error.
    await this.cartService.getCart(data.cartId);
    const vendor = await this.vendorService.getVendor(data.vendorId);

    // if vendor and cart exists we can successfully create the order.
    const res = await this.prisma.order.create({ data });

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

    const res = await this.prisma.order.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
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
      }
    }

    return res;
  }

  async deleteOrder(id: string): Promise<Order> {
    return await this.prisma.order.delete({ where: { id } });
  }
}
