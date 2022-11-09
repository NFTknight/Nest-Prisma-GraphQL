import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProductVariant } from 'src/products/models/product-variant.model';
import { Product } from 'src/products/models/product.model';
import { ProductVariantsService } from 'src/products/services/product-variants.service';
import { ProductsService } from 'src/products/services/products.service';
import { AddToCartInput } from '../dto/add-to-cart.input';
import { CartItem } from '../models/cart-item.model';
import { CartService } from './cart.service';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService
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
    this.updateTotalPrice(cartId);
    return item;
  }

  async removeItemFromCart(cartItemId: string): Promise<CartItem> {
    const removedItem = await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    this.updateTotalPrice(cartItemId);
    return removedItem;
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

  async updateTotalPrice(cartId: string) {
    const cartItems = await this.getCartItems(cartId);
    let totalPrice = 0;

    for (let i = 0; i < cartItems.length; ++i) {
      const cItem = cartItems[i];

      let prodEntity: Product | ProductVariant;
      if (cItem.productVariantId) {
        prodEntity = await this.productVariantsService.getProductVariant(
          cItem.productVariantId
        );
      } else {
        prodEntity = await this.productsService.getProduct(cItem.productId);
      }

      totalPrice += prodEntity.price * cItem.quantity;
    }

    await this.cartService.updateCartPrice(cartId, {
      totalPrice,
    });
  }
}
