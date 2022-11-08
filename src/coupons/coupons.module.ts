import { Module } from '@nestjs/common';
import { VendorsModule } from 'src/vendors/vendors.module';
import { CouponsResolver } from './coupons.resolver';
import { CouponsService } from './coupons.service';

@Module({
  imports: [VendorsModule],
  providers: [CouponsResolver, CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
