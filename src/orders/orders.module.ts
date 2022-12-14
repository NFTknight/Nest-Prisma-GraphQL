import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { VendorsModule } from 'src/vendors/vendors.module';
import { OrdersResolver } from './order.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [VendorsModule, CartModule],
  providers: [OrdersService, OrdersResolver, SendgridService],
  exports: [OrdersService],
})
export class OrdersModule {}
