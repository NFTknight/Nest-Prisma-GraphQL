import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/services/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import {
  BookingStatus,
  Booking,
  OrderStatus,
  PaymentMethods,
} from '@prisma/client';
import { TagsService } from 'src/tags/tags.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { nanoid } from 'nanoid';
import { PaginatedBookings } from './models/paginated-bookings.model';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService,
    private readonly cartService: CartService,
    private readonly tagService: TagsService,
    private readonly vendorService: VendorsService
  ) {}

  async getBooking(id: string): Promise<Booking> {
    if (!id) return null;
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException('Booking Not Found.');

    return booking;
  }

  async getBookings(where: any): Promise<Booking[]> {
    const res = await this.prisma.booking.findMany({ where });

    if (!res) throw new NotFoundException('Bookings Not Found.');

    return res;
  }

  async getAllBookings(
    pg?: PaginationArgs,
    sortOrder?: SortOrder
  ): Promise<PaginatedBookings> {
    try {
      const { skip, take } = getPaginationArgs(pg);
      let orderBy = {};
      if (sortOrder) {
        orderBy[sortOrder.field] = sortOrder.direction;
      } else {
        orderBy = {
          updatedAt: 'desc',
        };
      }

      const list = await this.prisma.booking.findMany({
        skip,
        take,
        orderBy,
      });

      if (!list) throw new NotFoundException('Bookings Not Found.');

      const totalCount = await this.prisma.booking.count();

      return {
        list,
        totalCount,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async createBooking(data: CreateBookingInput): Promise<Booking> {
    const { vendorId, customerInfo, productId, tagId, slots, status } = data;
    // if the cart/product or order does not exist, this function will throw an error.
    const product = await this.productService.getProduct(productId);
    await this.vendorService.getVendor(vendorId);
    await this.tagService.getTag(tagId);
    // if all of these exist we can successfully create the booking.

    const vendorPrefix = await this.vendorService.getVendorOrderPrefix(
      vendorId
    );
    const orderId = `${vendorPrefix}-${nanoid(8)}`.toUpperCase();

    const productVariant = product.variants[0];

    const order = await this.prisma.order.create({
      data: {
        orderId,
        items: [
          {
            tagId,
            quantity: slots.length,
            price: productVariant.price,
            productId,
            slots,
            sku: productVariant.sku,
          },
        ],
        totalPrice: productVariant.price * slots.length,
        finalPrice: productVariant.price * slots.length,
        customerInfo,
        customerId: customerInfo.email,
        status: OrderStatus.CONFIRMED,
        paymentMethod: PaymentMethods.STORE,
      },
    });

    return this.prisma.booking.create({
      data: {
        order: { connect: { id: order.id } },
        vendor: { connect: { id: vendorId } },
        tag: { connect: { id: tagId } },
        product: { connect: { id: productId } },
        slots,
        status,
      },
    });
  }

  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    if (data.orderId) {
      await this.orderService.getOrder(data.orderId);
    }
    // remove booking holdtimestamp when order is created for this booking
    if ((data.status && data.status !== BookingStatus.HOLD) || data.orderId) {
      await this.prisma.$runCommandRaw({
        update: 'Booking',
        updates: [
          {
            q: { _id: { $eq: { $oid: id } } },
            u: { $unset: { holdTimestamp: '' } },
          },
        ],
      });
    }
    return this.prisma.booking.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteBooking(id: string): Promise<Booking> {
    return await this.prisma.booking.delete({ where: { id } });
  }
}
