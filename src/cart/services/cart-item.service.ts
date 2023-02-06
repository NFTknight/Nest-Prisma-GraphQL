import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus, ProductType } from '@prisma/client';
import { findIndex } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { Product } from 'src/products/models/product.model';
import { checkIfQuantityIsGood, getReadableDate } from 'src/utils/general';
import { throwNotFoundException } from 'src/utils/validation';
import { WorkshopService } from 'src/workshops/workshops.service';
import { ProductsService } from '../../products/services/products.service';
import { CartItemInput } from '../dto/cart.input';
import { CartItem } from '../models/cart-item.model';
import { Cart } from '../models/cart.model';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workshopService: WorkshopService,
    private readonly productService: ProductsService
  ) {}

  async addProduct(product: Product, cart: Cart, item: CartItemInput) {
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
      const newQuantity =
        newCart.items[existingProductIndex].quantity + quantity;
      if (
        //this is to bypass the itemsToStock, needs to converted to check individual product variant quantity which is coming inside productVariant.quantity
        product.type === ProductType.PRODUCT &&
        !checkIfQuantityIsGood(newQuantity, productVariant.quantity)
      ) {
        throw new BadRequestException(
          `You can't add more than ${productVariant.quantity} no of products in your cart. You already have ${newCart.items[existingProductIndex].quantity} item(s)`
        );
      } else {
        if (product.type === ProductType.PRODUCT)
          newCart.items[existingProductIndex].quantity = newQuantity;
      }

      if (product.type === ProductType.WORKSHOP) {
        const workshopBooking = await this.prisma.workshop.findFirst({
          where: {
            productId: product.id,
            cartId: cart.id,
          },
        });

        const existingWorkshopBooking = await this.prisma.workshop.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            productId: product.id,
            NOT: {
              cartId: cart.id,
            },
          },
        });

        const availableQuantity =
          product.noOfSeats -
          (product.bookedSeats + existingWorkshopBooking?._sum?.quantity || 0);

        console.log({
          availableQuantity,
          existingWorkshopBooking: existingWorkshopBooking._sum.quantity,
        });
        if (
          !!workshopBooking &&
          //this is to bypass the itemsToStock, needs to converted to check individual product variant quantity which is coming inside productVariant.quantity
          !checkIfQuantityIsGood(newQuantity, availableQuantity)
        ) {
          throw new BadRequestException(
            `You can't add more than ${availableQuantity} no of seats in your cart. You already have ${newCart.items[existingProductIndex].quantity} seat(s)`
          );
        } else if (
          !workshopBooking &&
          !checkIfQuantityIsGood(quantity, availableQuantity)
        ) {
          if (!availableQuantity)
            throw new BadRequestException(
              `No seats available for this workshop`
            );

          throw new BadRequestException(
            `You can't add more than ${availableQuantity} no of seats in your cart.`
          );
        }

        if (!!workshopBooking) {
          this.workshopService.updateWorkshop(workshopBooking.id, {
            quantity: newCart.items[existingProductIndex].quantity + quantity,
          });

          newCart.items[existingProductIndex].quantity = newQuantity;
        } else {
          await this.workshopService.createWorkshop({
            productId: product.id,
            cartId: cart.id,
            quantity: quantity,
          });
          newCart.items[existingProductIndex].quantity = quantity;
        }
      }
    } else {
      if (
        product.type === ProductType.PRODUCT &&
        !checkIfQuantityIsGood(quantity, productVariant.quantity)
      ) {
        throw new BadRequestException(
          `You can't add more than ${productVariant.quantity} no of products in your cart.`
        );
      }
      if (product.type === ProductType.WORKSHOP) {
        const existingWorkshopBooking = await this.prisma.workshop.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            productId: product.id,
            NOT: {
              cartId: cart.id,
            },
          },
        });
        const availableQuantity =
          product.noOfSeats -
          (product.bookedSeats + existingWorkshopBooking?._sum?.quantity || 0);

        if (!checkIfQuantityIsGood(quantity, availableQuantity)) {
          if (availableQuantity) {
            throw new BadRequestException(
              `You can't add more than ${availableQuantity} no of seats in your cart.`
            );
          }

          throw new BadRequestException(
            `Seats are not available for this workshop`
          );
        }

        await this.workshopService.createWorkshop({
          productId: product.id,
          cartId: cart.id,
          quantity: quantity,
        });
      }

      newCart.items.push({
        ...item,
        expired: false,
        price: productVariant.price,
      });
    }

    if (product.type == ProductType.SERVICE) {
      const updatedCartItem = newCart.items.filter(
        (cartItem) =>
          cartItem.productId === item.productId && cartItem.sku === item.sku
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
              availableSlots.findIndex(
                (availableSlot) => availableSlot.from === slot.from
              ) === -1
            ) {
              availableSlots.push(slot);
            }
          }
        });
      });
      if (!isAdded) {
        newCart.items = [
          ...newCart.items,

          {
            ...item,
            expired: false,
            price:
              product?.variants?.find((variant) => variant.sku === item.sku)
                ?.price || 0,
          },
        ];
      }
    }
    newCart.subTotal = newCart.items.reduce((acc, item) => {
      if (item?.slots?.length) {
        return acc + item.price * item.slots.length;
      }

      return acc + item.price * item.quantity;
    }, 0);

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

  createBooking = async (slots, tagId, vendorId, cartId, productId) => {
    await this.prisma.booking.create({
      data: {
        status: BookingStatus.HOLD,
        slots: slots,
        tag: { connect: { id: tagId } },
        vendor: { connect: { id: vendorId } },
        cart: { connect: { id: cartId } },
        product: { connect: { id: productId } },
        holdTimestamp: new Date(),
      },
    });
  };

  // TODO revisit HOLD booking logic
  async addServiceToCart(
    product: Product,
    cart: Cart,
    item: CartItemInput
  ): Promise<Cart> {
    const newCart = this.addProduct(product, cart, item);

    const allExistingBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.HOLD,
        productId: product.id,
        cartId: cart.id,
      },
    });

    let slotFound = false;

    for (const booking of allExistingBookings) {
      if (
        getReadableDate(booking?.slots?.[0]?.from?.toString()) ===
        getReadableDate(item?.slots?.[0]?.from?.toString())
      ) {
        slotFound = true;
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: {
            holdTimestamp: new Date(),
            slots: {
              push: item.slots,
            },
          },
        });
      }
    }

    if (!slotFound) {
      await this.createBooking(
        item.slots,
        item.tagId,
        product.vendorId,
        cart.id,
        product.id
      );
    }

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
