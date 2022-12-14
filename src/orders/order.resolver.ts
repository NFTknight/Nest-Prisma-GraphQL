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
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './models/order.model';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly vendorService: VendorsService,
    private readonly cartService: CartService
  ) {}

  @Query(() => Order)
  getOrder(@Args('id') id: string): Promise<Order> {
    return this.ordersService.getOrder(id);
  }

  @Query(() => [Order])
  async getOrders(@Args('vendorId', { nullable: true }) vendorId?: string) {
    try {
      const orders = this.ordersService.getOrders(vendorId);

      return orders;
    } catch (err) {
      console.log('something went wrong', err);
      return [];
    }
  }

  @Mutation(() => Order)
  createOrder(@Args('data') data: CreateOrderInput): Promise<Order> {
    return this.ordersService.createOrder(data);
  }

  @Mutation(() => Order)
  updateOrder(
    @Args('id') id: string,
    @Args('data') data: UpdateOrderInput
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, data);
  }

  @Mutation(() => Order)
  deleteOrder(@Args('id') id: string): Promise<Order> {
    return this.ordersService.deleteOrder(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() order: Order): Promise<Vendor> {
    return this.vendorService.getVendor(order.vendorId);
  }
  @ResolveField('cart')
  cart(@Parent() order: Order): Promise<Cart> {
    return this.cartService.getCart(order.cartId);
  }
}
