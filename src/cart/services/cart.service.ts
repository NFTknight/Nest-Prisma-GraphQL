import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Cart } from '../models/cart.model';

import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewCart(customerId: string): Promise<Cart> {
    return await this.prisma.cart.create({
      data: { customerId, totalPrice: 0, finalPrice: 0 },
    });
  }

  async getCart(cartId: string, vendorId?: string): Promise<Cart> {
    if (!cartId && !vendorId) {
      throw new GraphQLError('Cart id or Vendor id must be provided', {
        extensions: {
          code: 400,
        },
      });
    }
    if (cartId) {
      return await this.prisma.cart.findUnique({
        where: { id: cartId },
      });
    } else {
      console.log(vendorId);
      return await this.createNewCart(vendorId);
    }
  }

  async getCartByCustomer(customerId: string): Promise<Cart> {
    const existingCart = await this.prisma.cart.findUnique({
      where: { customerId },
    });
    if (!existingCart) {
      return await this.createNewCart(customerId);
    } else return existingCart;
  }

  async updateCartPrice(
    cartId: string,
    prices: { totalPrice: number }
  ): Promise<Cart> {
    return await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        ...prices,
      },
    });
  }

  async checkoutCart(cartId: string) {
    const cart = await this.getCart(cartId);
    // const cartItems = await this.cartItemService.getCartItems(cartId);

    return;
  }
}
