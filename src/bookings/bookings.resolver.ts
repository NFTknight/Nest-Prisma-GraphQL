import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Cart } from 'src/cart/models/cart.model';
import { CartService } from 'src/cart/services/cart.service';
import { Order } from 'src/orders/models/order.model';
import { OrdersService } from 'src/orders/orders.service';
import { Product } from 'src/products/models/product.model';
import { ProductsService } from 'src/products/services/products.service';

import { BookingsService } from './bookings.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { Booking } from './models/booking.model';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductsService,
    private readonly orderService: OrdersService,
    private readonly bookingService: BookingsService
  ) {}

  @Query(() => Booking)
  getBooking(@Args('id') id: string): Promise<Booking | null> {
    return this.bookingService.getBooking(id);
  }

  @Mutation(() => Booking)
  createBooking(@Args('data') data: CreateBookingInput): Promise<Booking> {
    return this.bookingService.createBooking(data);
  }

  @Mutation(() => Booking)
  updateBooking(
    @Args('id') id: string,
    @Args('data') data: UpdateBookingInput
  ): Promise<Booking> {
    return this.bookingService.updateBooking(id, data);
  }

  @Mutation(() => Booking)
  deleteBooking(@Args('id') id: string): Promise<Booking> {
    return this.bookingService.deleteBooking(id);
  }

  @ResolveField('Cart')
  Cart(@Parent() booking: Booking): Promise<Cart> {
    return this.cartService.getCart(booking.cartId);
  }
  @ResolveField('Product')
  Product(@Parent() booking: Booking): Promise<Product> {
    return this.productService.getProduct(booking.productId);
  }
  @ResolveField('Order')
  Order(@Parent() booking: Booking): Promise<Order> {
    return this.orderService.getOrder(booking.orderId);
  }
}
