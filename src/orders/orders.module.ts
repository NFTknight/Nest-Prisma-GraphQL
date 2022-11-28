import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { CartService } from 'src/cart/services/cart.service';
import { OrdersService } from './orders.service';

@Module({
  imports: [CartModule],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
