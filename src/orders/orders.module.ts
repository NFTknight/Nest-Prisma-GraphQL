import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CartModule } from 'src/cart/cart.module';
import { ProductsService } from 'src/products/services/products.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ShippingModule } from 'src/shipping/shipping.module';
import { ShippingService } from 'src/shipping/shipping.service';
import { VendorsModule } from 'src/vendors/vendors.module';
import { OrdersResolver } from './order.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    VendorsModule,
    forwardRef(() => CartModule),
    ShippingModule,
    HttpModule,
  ],
  providers: [
    OrdersService,
    JwtService,
    OrdersResolver,
    SendgridService,
    ShippingService,
    ProductsService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
