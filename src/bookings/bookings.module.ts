import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { TagModule } from 'src/tags/tags.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { BookingResolver } from './bookings.resolver';
import { BookingsService } from './bookings.service';

@Module({
  imports: [CartModule, ProductsModule, OrdersModule, TagModule, VendorsModule],
  providers: [BookingResolver, BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
