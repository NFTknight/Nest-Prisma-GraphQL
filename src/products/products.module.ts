import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { VendorsModule } from 'src/vendors/vendors.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [VendorsModule, CategoriesModule],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
