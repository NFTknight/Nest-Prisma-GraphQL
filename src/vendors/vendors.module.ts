import { Module } from '@nestjs/common';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { VendorsResolver } from './vendors.resolver';
import { VendorsService } from './vendors.service';

@Module({
  imports: [SendgridModule],
  providers: [VendorsResolver, VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
