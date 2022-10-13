import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CartItem } from '../models/cart-item.model';
import { Cart } from '../models/cart.model';
import { CartItemService } from '../services/cart-item.service';
import { CartService } from '../services/cart.service';

@Resolver(Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService
  ) {}

  @Query(() => Cart)
  getCart(@Args('cartId') cartId: string): Promise<Cart> {
    return this.cartService.getCart(cartId);
  }

  @ResolveField('items')
  async items(@Parent() parent: Cart): Promise<CartItem[]> {
    return this.cartItemService.getCartItems(parent.id);
  }
}
