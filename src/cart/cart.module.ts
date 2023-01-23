import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ProductsModule } from 'src/products/products.module';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { ShippingService } from 'src/shipping/shipping.service';
import { VendorsModule } from 'src/vendors/vendors.module';
import { WorkshopService } from 'src/workshops/workshops.service';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { CartItemService } from './services/cart-item.service';

@Module({
  imports: [
    ProductsModule,
    forwardRef(() => OrdersModule),
    VendorsModule,
    SendgridModule,
    PaymentModule,
    HttpModule,
  ],
  providers: [
    CartItemService,
    CartService,
    CartResolver,
    ShippingService,
    WorkshopService,
  ],
  exports: [CartService, CartItemService],
})
export class CartModule {}
