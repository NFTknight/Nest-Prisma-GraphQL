import {
  Args,
  Mutation,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Product } from 'src/products/models/product.model';
import { ProductsService } from 'src/products/services/products.service';
import { AddToCartInput } from '../dto/add-to-cart.input';
import { CartItem } from '../models/cart-item.model';
import { CartItemService } from '../services/cart-item.service';

@Resolver(CartItem)
export class CartItemResolver {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductsService
  ) {}
  @Mutation(() => CartItem)
  addItemToCart(@Args('data') data: AddToCartInput): Promise<CartItem> {
    return this.cartItemService.addItemToCart(data);
  }

  @Mutation(() => CartItem)
  removeItemFromCart(
    @Args('cartItemId') cartItemId: string
  ): Promise<CartItem> {
    return this.cartItemService.removeItemFromCart(cartItemId);
  }

  @Mutation(() => CartItem)
  updateCartItemQuantity(
    @Args('cartItemId') cartItemId: string,
    @Args('quantity') quantity: number
  ): Promise<CartItem> {
    return this.cartItemService.updateQuantity(cartItemId, quantity);
  }

  @ResolveField('Product')
  Product(@Parent() cartItem: CartItem): Promise<Product | null> {
    return this.productService.getProduct(cartItem.productId);
  }
}
