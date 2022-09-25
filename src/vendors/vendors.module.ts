import { Module } from '@nestjs/common';
import { VendorsResolver } from './vendors.resolver';
import { VendorsService } from './vendors.service';

@Module({
  imports: [],
  providers: [VendorsResolver, VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
