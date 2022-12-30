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
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { PaginatedBookings } from './models/paginated-bookings.model';
import { SortOrder } from 'src/common/sort-order/sort-order.input';

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
  @Query(() => [Booking])
  async getBookings(
    @Args('vendorId') vendorId: string,
    @Args('productId', { nullable: true }) productId: string,
    @Args('tagId', { nullable: true }) tagId: string
  ): Promise<Booking[]> {
    const where = {
      vendorId,
    };

    if (productId) {
      where['productId'] = productId;
    }
    if (tagId) {
      where['tagId'] = tagId;
    }

    const res = await this.bookingService.getBookings(where);
    return res;
  }

  @Query(() => PaginatedBookings)
  async getAllBookings(
    @Args('pagination', { nullable: true }) pg: PaginationArgs,
    @Args('sortBooking', { nullable: true }) sortOrder: SortOrder
  ): Promise<PaginatedBookings> {
    return this.bookingService.getAllBookings(pg, sortOrder);
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
