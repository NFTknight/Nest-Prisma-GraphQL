import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { CartItemResolver } from './resolvers/cart-item.resolver';
import { CartResolver } from './resolvers/cart.resolver';
import { CartItemService } from './services/cart-item.service';
import { CartService } from './services/cart.service';

@Module({
  imports: [ProductsModule],
  providers: [CartItemService, CartService, CartResolver, CartItemResolver],
  exports: [CartService],
})
export class CartModule {}
