import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AddToCartInput } from '../dto/add-to-cart.input';
import { CartItem } from '../models/cart-item.model';
import { CartService } from './cart.service';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService
  ) {}

  async getCartItems(cartId: string): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany({ where: { cartId } });
  }

  async addItemToCart(data: AddToCartInput): Promise<CartItem> {
    let { cartId } = data;
    if (!cartId) {
      const cart = await this.cartService.createNewCart(data.vendorId);
      cartId = cart.id;
    }
    const item = await this.prisma.cartItem.create({
      data: { ...data, cartId },
    });
    return item;
  }

  async removeItemFromCart(cartItemId: string): Promise<CartItem> {
    return await this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async updateQuantity(
    cartItemId: string,
    quantity: number
  ): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }
}
