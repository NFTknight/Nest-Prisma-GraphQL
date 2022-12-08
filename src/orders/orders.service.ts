import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/services/cart.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly vendorService: VendorsService
  ) {}

  async getOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id } });

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
    await this.vendorService.getVendor(data.vendorId);

    // if vendor and cart exists we can successfully create the order.
    return this.prisma.order.create({ data });
  }

  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    if (data.vendorId) {
      // if the vendor does not exist, this function will throw an error.
      await this.vendorService.getVendor(data.vendorId);
    }
    if (data.cartId) {
      // if the order does not exist, this function will throw an error.
      await this.cartService.getCart(data.cartId);
    }

    return this.prisma.order.update({
      where: { id },
      data: { ...data, updatedAt: new Date() } as any,
    });
  }

  async deleteOrder(id: string): Promise<Order> {
    return await this.prisma.order.delete({ where: { id } });
  }
}
