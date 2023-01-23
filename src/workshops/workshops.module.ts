import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { TagModule } from 'src/tags/tags.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { WorkshopResolver } from './workshops.resolver';
import { WorkshopService } from './workshops.service';

@Module({
  imports: [CartModule, ProductsModule, OrdersModule, TagModule, VendorsModule],
  providers: [WorkshopResolver, WorkshopService],
  exports: [WorkshopService],
})
export class WorkshopModule {}
