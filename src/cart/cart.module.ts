import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { CartItemService } from './services/cart-item.service';

@Module({
  imports: [ProductsModule],
  providers: [CartItemService, CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
