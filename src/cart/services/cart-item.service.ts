import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { findIndex } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { Product } from 'src/products/models/product.model';
import { ProductsService } from '../../products/services/products.service';
import { CartItemInput } from '../dto/cart.input';
import { Cart } from '../models/cart.model';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService
  ) {}

  addProduct(product: Product, cart: Cart, item: CartItemInput) {
    const { sku, quantity } = item;
    const newCart = { ...cart };

    const productVariant = product.variants.find(
      (variant) => variant.sku === sku
    );

    if (!productVariant) {
      throw new NotFoundException(`Product variant with sku ${sku} not found`);
    }

    const existingProductIndex = findIndex(newCart.items, {
      productId: product.id,
      sku: productVariant.sku,
    });

    if (existingProductIndex !== -1) {
      // if the cart item exists, update the quantity
      newCart.items[existingProductIndex].quantity += quantity;
    } else {
      // if the cart item does not exist, create the item
      newCart.items.push({
        ...item,
        price: productVariant.price,
      });
    }

    // update the cart price
    newCart.totalPrice = newCart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    newCart.updatedAt = new Date();

    return newCart;
  }

  async addWorkshopToCart(
    product: Product,
    cart: Cart,
    item: CartItemInput
  ): Promise<Cart> {
    const newCart = this.addProduct(product, cart, item);

    const newBookedSeats = product.bookedSeats + item.quantity;
    if (newBookedSeats > product.noOfSeats) {
      throw new BadRequestException(
        `The number of booked seats (${newBookedSeats}) exceeds the number of seats available (${product.noOfSeats})`
      );
    }

    // update the booked seats
    await this.prisma.product.update({
      where: { id: product.id },
      data: {
        bookedSeats: {
          increment: item.quantity,
        },
      },
    });

    return newCart;
  }

  // TODO revisit HOLD booking logic
  async addServiceToCart(
    product: Product,
    cart: Cart,
    item: CartItemInput
  ): Promise<Cart> {
    const newCart = this.addProduct(product, cart, item);

    // create booking
    await this.prisma.booking.create({
      data: {
        status: BookingStatus.HOLD,
        slots: item.slots,
        tag: { connect: { id: item.tagId } },
        vendor: { connect: { id: product.vendorId } },
        cart: { connect: { id: cart.id } },
        product: { connect: { id: product.id } },
        holdTimestamp: new Date(),
      },
    });

    return newCart;
  }
}
