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
    const { productId, productVariant, quantity } = data;
    if (!cartId) {
      const cart = await this.cartService.createNewCart(data.vendorId);
      cartId = cart.id;
    }

    const item = await this.prisma.cartItem.create({
      data: { productId, productVariant, quantity, cartId },
    });
    // update cart price
    return item;
  }

  async removeItemFromCart(cartItemId: string): Promise<CartItem> {
    const removedItem = await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    // update cart price
    return removedItem;
  }

  async updateQuantity(
    cartItemId: string,
    quantity: number
  ): Promise<CartItem> {
    const updatedItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
    // update cart price
    return updatedItem;
  }
}
