import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cart } from './models/cart.model';
import { CartService } from './cart.service';
import { CartItemInput, CartUpdateInput } from './dto/cart.input';
import { Order } from 'src/orders/models/order.model';
import { OrdersService } from 'src/orders/orders.service';
import { OrderStatus } from '@prisma/client';

@Resolver(Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrdersService
  ) {}

  @Query(() => Cart)
  async getCustomerCart(
    @Args('vendorId') vendorId: string,
    @Args('customerId') customerId: string
  ): Promise<Cart> {
    let cart: Cart = await this.cartService.getCartByCustomer(
      customerId,
      vendorId
    );

    if (!cart) {
      cart = await this.cartService.createNewCart(vendorId, customerId);
    }

    return cart;
  }

  @Mutation(() => Cart)
  async addItemToCart(
    @Args('cartId') cartId: string,
    @Args('data', {
      type: () => CartItemInput,
    })
    data: CartItemInput
  ) {
    return this.cartService.addItemToCart(cartId, data);
  }

  @Mutation(() => Cart)
  async addProductToCart(
    @Args('cartId') cartId: string,
    @Args('data', {
      type: () => CartItemInput,
    })
    data: CartItemInput
  ) {
    return this.cartService.addItemToCart(cartId, data);
  }

  @Mutation(() => Cart)
  async addWorkshopToCart(
    @Args('cartId') cartId: string,
    @Args('data', {
      type: () => CartItemInput,
    })
    data: CartItemInput
  ) {
    return this.cartService.addItemToCart(cartId, data);
  }

  @Mutation(() => Cart)
  async addServiceToCart(
    @Args('cartId') cartId: string,
    @Args('data', {
      type: () => CartItemInput,
    })
    data: CartItemInput
  ) {
    return this.cartService.addItemToCart(cartId, data);
  }

  @Mutation(() => Cart)
  removeCartItem(
    @Args('cartId') cartId: string,
    @Args('productId') productId: string,
    @Args('sku') sku: string
  ) {
    return this.cartService.removeItemFromCart(cartId, productId, sku);
  }

  @Mutation(() => Cart)
  updateCartItem(
    @Args('cartId') cartId: string,
    @Args('data') data: CartItemInput
  ) {
    return this.cartService.updateCartItem(cartId, data);
  }

  @Mutation(() => Cart)
  async updateCart(
    @Args('cartId') cartId: string,
    @Args('data') data: CartUpdateInput
  ) {
    let cart: Cart | null = await this.cartService.getCart(cartId);

    if (cart) {
      cart = await this.cartService.updateCart(cartId, data);
    }
    return cart;
  }

  @Mutation(() => Order)
  checkoutCart(@Args('cartId') cartId: string) {
    return this.cartService.checkoutCartAndCreateOrder(cartId);
  }
}
