import { Module } from '@nestjs/common';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { VendorsResolver } from './vendors.resolver';
import { VendorsService } from './vendors.service';

@Module({
  imports: [],
  providers: [VendorsResolver, VendorsService, SendgridService],
  exports: [VendorsService],
})
export class VendorsModule {}
