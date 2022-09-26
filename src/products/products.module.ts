import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductResolver } from './products.resolver';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports: [VendorsModule],
  providers: [ProductResolver, ProductsService],
})
export class ProductsModule {}
