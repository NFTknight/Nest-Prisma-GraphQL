import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Cart } from 'src/cart/models/cart.model';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/services/products.service';

import { BookingsService } from './bookings.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { Booking } from './models/booking.model';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { PaginatedBookings } from './models/paginated-bookings.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductsService,
    private readonly bookingService: BookingsService
  ) {}

  @Query(() => Booking)
  getBooking(@Args('id') id: string): Promise<Booking | null> {
    return this.bookingService.getBooking(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedBookings)
  async getBookings(
    @Args('vendorId') vendorId: string,
    @Args('productId', { nullable: true }) productId: string,
    @Args('tagId', { nullable: true }) tagId: string,
    @Args('pagination', { nullable: true }) pg: PaginationArgs
  ): Promise<PaginatedBookings> {
    const where = {
      vendorId,
    };

    if (productId) {
      where['productId'] = productId;
    }
    if (tagId) {
      where['tagId'] = tagId;
    }

    const res = await this.bookingService.getBookings(where, pg);
    return res;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Booking)
  createBooking(@Args('data') data: CreateBookingInput): Promise<Booking> {
    return this.bookingService.createBooking(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Booking)
  updateBooking(
    @Args('id') id: string,
    @Args('data') data: UpdateBookingInput
  ): Promise<Booking> {
    return this.bookingService.updateBooking(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Booking)
  deleteBooking(@Args('id') id: string): Promise<Booking> {
    return this.bookingService.deleteBooking(id);
  }

  @ResolveField('cart', () => Cart)
  cart(@Parent() booking: Booking): Promise<Cart> {
    return this.cartService.getCart(booking.cartId);
  }

  @ResolveField('product')
  product(@Parent() booking: Booking) {
    return this.productService.getProduct(booking.productId);
  }
}
