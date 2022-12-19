import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Cart } from '../models/cart.model';

import { GraphQLError } from 'graphql';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewCart(customerId: string): Promise<Cart> {
    return await this.prisma.cart.create({
      data: { customerId, totalPrice: 0, finalPrice: 0 },
    });
  }

  async getCart(cartId: string, customerId?: string): Promise<Cart> {
    if (!cartId && !customerId) {
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
      return await this.createNewCart(customerId);
    }
  }

  async getCartByCustomer(customerId: string): Promise<Cart> {
    const existingCart = await this.prisma.cart.findUnique({
      where: {
        customerId: customerId,
      },
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
