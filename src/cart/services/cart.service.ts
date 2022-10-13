import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Cart } from '../models/cart.model';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewCart(vendorId: string): Promise<Cart> {
    return await this.prisma.cart.create({
      data: { vendorId },
    });
  }

  async getCart(cartId: string): Promise<Cart> {
    return await this.prisma.cart.findUnique({ where: { id: cartId } });
  }
}
