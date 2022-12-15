import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/services/cart.service';
import { ProductsService } from 'src/products/services/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { BookingStatus, Booking } from '@prisma/client';
import { TagsService } from 'src/tags/tags.service';
import { VendorsService } from 'src/vendors/vendors.service';

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
    const booking = await this.prisma.booking.findMany({ where });

    if (!booking) throw new NotFoundException('Bookings Not Found.');

    return booking;
  }

  async createBooking(data: CreateBookingInput): Promise<Booking> {
    const { vendorId, cartId, productId, tagId, ...rest } = data;
    // if the cart/product or order does not exist, this function will throw an error.
    await this.cartService.getCart(data.cartId);
    await this.productService.getProduct(data.productId);
    await this.vendorService.getVendor(data.vendorId);
    await this.tagService.getTag(data.tagId);
    // if all of these exist we can successfully create the booking.

    return this.prisma.booking.create({
      data: {
        ...rest,
        Vendor: { connect: { id: vendorId } },
        Cart: { connect: { id: cartId } },
        Tag: { connect: { id: tagId } },
        Product: { connect: { id: productId } },
      },
    });
  }

  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    if (data.orderId) {
      await this.orderService.getOrder(data.orderId);
    }
    if (data.status !== BookingStatus.HOLD) {
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
