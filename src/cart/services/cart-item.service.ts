import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus, ProductType } from '@prisma/client';
import * as dayjs from 'dayjs';
import { findIndex } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { Product } from 'src/products/models/product.model';
import { getReadableDate } from 'src/utils/general';
import { throwNotFoundException } from 'src/utils/validation';
import { ProductsService } from '../../products/services/products.service';
import { CartItemInput } from '../dto/cart.input';
import { CartItem } from '../models/cart-item.model';
import { Cart } from '../models/cart.model';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService
  ) {}

  addProduct(product: Product, cart: Cart, item: CartItemInput) {
    const { sku, quantity } = item;

    throwNotFoundException(cart, 'Cart');

    const newCart = { ...cart };

    const productVariant = product.variants.find(
      (variant) => variant.sku === sku
    );

    throwNotFoundException(
      productVariant,
      '',
      `Product variant with sku ${sku} not found`
    );

    const existingProductIndex = findIndex(newCart?.items || [], {
      productId: product.id,
      sku: productVariant.sku,
    });
    const deliveryCharges = newCart.totalPrice - newCart.subTotal;

    if (existingProductIndex !== -1) {
      if (
        //this is to bypass the itemsToStock, needs to converted to check individual product variant quantity which is coming inside productVariant.quantity
        product.type === ProductType.PRODUCT &&
        product.itemsInStock !== null &&
        product.itemsInStock < newCart.items[existingProductIndex].quantity
      ) {
        throw new BadRequestException(
          `You can't add more than ${product.itemsInStock} no of products in your cart. You already have ${newCart.items[existingProductIndex].quantity} item(s)`
        );
      }

      newCart.items[existingProductIndex].quantity += quantity;
    } else {
      if (
        product.type === ProductType.PRODUCT &&
        productVariant.quantity < quantity
      ) {
        throw new BadRequestException(
          `You can't add more than ${productVariant.quantity} no of products in your cart.`
        );
      }
      // if the cart item does not exist, create the item
      newCart.items.push({
        ...item,
        price: productVariant.price,
      });
    }

    if (product.type == ProductType.SERVICE) {
      const updatedCartItem = newCart.items.filter(
        (cartItem) => cartItem.productId === item.productId
      );
      let isAdded = false;
      updatedCartItem.map((cartItem) => {
        //these are the slots in a particular date....
        const availableSlots = cartItem.slots;

        item.slots.map((slot) => {
          // this matches the dates exists or not...
          const slotAvailable = availableSlots.findIndex(
            (availableSlots) =>
              getReadableDate(availableSlots.from.toString()) ===
              getReadableDate(slot.from.toString())
          );

          if (slotAvailable !== -1) {
            isAdded = true;
            //this is whether the booking already exists for a particular date for same timestamp
            if (
              !availableSlots.find(
                (availableSlot) => availableSlot.from === slot.from
              )
            )
              availableSlots.push(slot);
          }
        });
      });
      if (!isAdded) {
        newCart.items = [
          ...newCart.items,
          {
            ...item,
            price:
              product?.variants?.find((variant) => variant.sku === item.sku)
                ?.price || 0,
          },
        ];
      }
    }
    newCart.subTotal = newCart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    newCart.totalPrice = newCart.subTotal + deliveryCharges;

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

  async resolveItems(items: CartItem[]) {
    const resolvedItems = [];

    for (const item of items) {
      const product = await this.productService.getProduct(item.productId);

      resolvedItems.push({
        ...item,
        product,
      });
    }

    return resolvedItems;
  }
}
