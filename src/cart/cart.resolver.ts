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
import { throwNotFoundException } from 'src/utils/validation';
import { PrismaService } from 'nestjs-prisma';
const SMSA_DELVERY_CHARGE = 30;
@Resolver(Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
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
    @Args('sku') sku: string,
    @Args('date', {
      type: () => String,
      nullable: true,
    })
    date?: string
  ) {
    const updatedCart = await this.cartService.removeItemFromCart(
      cartId,
      productId,
      sku,
      date || ''
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

    throwNotFoundException(cart, 'Cart');

    if (cart) {
      if (
        data.deliveryMethod === DeliveryMethods.MANDOOB &&
        !data.deliveryArea
      ) {
        throw new BadRequestException(
          'Delivery area is required if delivery method is MANDOOB'
        );
      }

      if (
        data.deliveryMethod &&
        data.deliveryMethod !== DeliveryMethods.MANDOOB
      )
        data.deliveryArea = null;

      const vendor = await this.prisma.vendor.findUnique({
        where: { id: cart.vendorId },
      });

      throwNotFoundException(vendor, 'Vendor');

      if (vendor && data.deliveryArea) {
        const deliveryCharges =
          vendor.settings.deliveryAreas.find(
            (item) => item.label === data.deliveryArea
          )?.charge || 0;
        // do logic here
        data.totalPrice = cart.finalPrice + deliveryCharges;
        data.deliveryCharges = deliveryCharges;
      }

      if (data.deliveryMethod === DeliveryMethods.SMSA) {
        // do logic here
        data.totalPrice = cart.finalPrice + SMSA_DELVERY_CHARGE;
        data.deliveryCharges = SMSA_DELVERY_CHARGE;
      }

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

    throwNotFoundException(cart, 'Cart');
    return this.cartItemService.resolveItems(cart.items);
  }
}
