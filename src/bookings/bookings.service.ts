import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/services/cart.service';
import { ProductsService } from 'src/products/services/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { Booking } from './models/booking.model';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService,
    private readonly cartService: CartService
  ) {}

  async getBooking(id: string): Promise<Booking> {
    if (!id) return null;
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException('Booking Not Found.');

    return booking;
  }

  async createBooking(data: CreateBookingInput): Promise<Booking> {
    // if the cart/product or order does not exist, this function will throw an error.
    await this.cartService.getCart(data.cartId);
    await this.productService.getProduct(data.productId);
    await this.orderService.getOrder(data.orderId);
    // if all of these exist we can successfully create the booking.

    return this.prisma.booking.create({ data });
  }

  async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
    const payload = {
      ...data,
      updatedAt: new Date(),
    };
    if (data.status !== BookingStatus.HOLD) {
      const res = await this.prisma.$runCommandRaw({
        update: 'Booking',
        updates: [
          {
            q: { _id: id },
            u: { $unset: { holdTimestamp: '' } },
          },
        ],
      });

      console.log('my res', res);
    }
    return this.prisma.booking.update({
      where: { id },
      data: { ...payload },
    });
  }

  async deleteBooking(id: string): Promise<Booking> {
    return await this.prisma.booking.delete({ where: { id } });
  }
}
