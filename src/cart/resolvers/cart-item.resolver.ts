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
import { CartService } from '../services/cart.service';

@Resolver(CartItem)
export class CartItemResolver {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductsService,
    private readonly cartService: CartService
  ) { }

  @Mutation(() => CartItem)
  async createCart(@Args('vendorId') vendorId: string) {
    return this.cartService.createNewCart(vendorId);
  }

  @Mutation(() => CartItem)
  async addProductToCart(
    @Args('data') data: AddToCartInput
  ): Promise<CartItem> {
    return this.cartItemService.addProductToCart(data);
  }

  @Mutation(() => CartItem)
  async addWorkshopToCart(
    @Args('data') data: AddToCartInput
  ): Promise<CartItem> {
    return this.cartItemService.addWorkspaceToCart(data);
  }

  @Mutation(() => CartItem)
  async addServiceToCart(
    @Args('data') data: AddToCartInput
  ): Promise<CartItem> {
    return this.cartItemService.addServiceToCart(data);
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
