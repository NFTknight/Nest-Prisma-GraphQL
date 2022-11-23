import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProductsService } from 'src/products/services/products.service';
import { Cart } from '../models/cart.model';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService
  ) {}

  async createNewCart(vendorId: string): Promise<Cart> {
    return await this.prisma.cart.create({
      data: { vendorId, totalPrice: 0, finalPrice: 0 },
    });
  }

  async getCart(cartId: string): Promise<Cart> {
    return await this.prisma.cart.findUnique({ where: { id: cartId } });
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
