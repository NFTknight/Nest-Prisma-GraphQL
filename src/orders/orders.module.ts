import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ShippingModule } from 'src/shipping/shipping.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { OrdersResolver } from './order.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [VendorsModule, CartModule, ShippingModule],
  providers: [OrdersService, OrdersResolver, SendgridService],
  exports: [OrdersService],
})
export class OrdersModule {}
