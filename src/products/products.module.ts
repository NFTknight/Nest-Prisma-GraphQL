import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports: [VendorsModule],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
