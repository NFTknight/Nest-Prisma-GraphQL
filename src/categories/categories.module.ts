import { Module } from '@nestjs/common';
import { VendorsModule } from 'src/vendors/vendors.module';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';

@Module({
  imports: [VendorsModule],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
