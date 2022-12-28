import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cart } from './models/cart.model';
import { CartService } from './cart.service';
import { CartItemInput, CartUpdateInput } from './dto/cart.input';
import { OrderPayment } from 'src/orders/models/order-payment.model';
import { DeliveryMethods } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Resolver(Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

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
      if (
        data.deliveryMethod === DeliveryMethods.MANDOOB &&
        !data.deliveryArea
      ) {
        throw new BadRequestException(
          'Delivery area is required if delivery method is MANDOOB'
        );
      }
      if (data.deliveryMethod !== DeliveryMethods.MANDOOB)
        data.deliveryArea = null;

      cart = await this.cartService.updateCart(cartId, data);
    }
    return cart;
  }

  @Mutation(() => OrderPayment)
  checkoutCart(
    @Args('cartId') cartId: string,
    @Args('paymentSession', {
      nullable: true,
    })
    paymentSession: string
  ) {
    return this.cartService.checkoutCartAndCreateOrder(cartId, paymentSession);
  }
}
