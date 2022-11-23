import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsResolver } from './resolvers/products.resolver';
import { VendorsModule } from 'src/vendors/vendors.module';
import { CategoriesModule } from 'src/categories/categories.module';
// import { ProductVariantsService } from './services/product-variants.service';
// import { ProductVariantsResolver } from './resolvers/product-variants.resolver';

@Module({
  imports: [VendorsModule, CategoriesModule],
  providers: [
    ProductsResolver,
    ProductsService,
    // ProductVariantsResolver,
    // ProductVariantsService,
  ],
  exports: [
    ProductsService,
    // ProductVariantsService
  ],
})
export class ProductsModule {}
