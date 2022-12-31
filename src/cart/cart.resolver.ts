import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Cart } from './models/cart.model';
import { CartService } from './cart.service';
import { CartItemInput, CartUpdateInput } from './dto/cart.input';
import { OrderPayment } from 'src/orders/models/order-payment.model';
import { DeliveryMethods } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { CartItemService } from './services/cart-item.service';

@Resolver(Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService
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
  async removeCartItem(
    @Args('cartId') cartId: string,
    @Args('productId') productId: string,
    @Args('sku') sku: string
  ) {
    const updatedCart = await this.cartService.removeItemFromCart(
      cartId,
      productId,
      sku
    );

    return updatedCart;
  }

  @Mutation(() => Cart)
  async updateCartItem(
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

  @ResolveField('items')
  async items(@Parent() { id: cartId }: Cart) {
    const cart = await this.cartService.getCart(cartId);
    // resolve or product in items
    return this.cartItemService.resolveItems(cart.items);
  }
}
