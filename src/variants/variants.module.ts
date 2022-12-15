import { Module } from '@nestjs/common';
import { VendorsModule } from 'src/vendors/vendors.module';
import { VariantsResolver } from './variants.resolver';
import { VariantsService } from './variants.service';

@Module({
  imports: [VendorsModule],
  providers: [VariantsResolver, VariantsService],
  exports: [VariantsService],
})
export class VariantsModule {}
