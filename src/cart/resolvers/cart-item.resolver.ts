import {
  Args,
  Mutation,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { ProductVariant } from 'src/products/models/product-variant.model';
import { Product } from 'src/products/models/product.model';
import { ProductVariantsService } from 'src/products/services/product-variants.service';
import { ProductsService } from 'src/products/services/products.service';
import { AddToCartInput } from '../dto/add-to-cart.input';
import { CartItem } from '../models/cart-item.model';
import { CartItemService } from '../services/cart-item.service';

@Resolver(CartItem)
export class CartItemResolver {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductsService,
    private readonly productVariantsService: ProductVariantsService
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

  @ResolveField('product')
  product(@Parent() cartItem: CartItem): Promise<Product | null> {
    if (!cartItem.productVariantId) return null;
    return this.productService.getProduct(cartItem.productVariantId);
  }

  @ResolveField('variant')
  variant(@Parent() cartItem: CartItem): Promise<ProductVariant | null> {
    if (!cartItem.productVariantId) return null;
    return this.productVariantsService.getProductVariant(
      cartItem.productVariantId
    );
  }
}
