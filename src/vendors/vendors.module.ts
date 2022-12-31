import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { VendorsResolver } from './vendors.resolver';
import { VendorsService } from './vendors.service';

@Module({
  imports: [SendgridModule],
  providers: [VendorsResolver, VendorsService, JwtService],
  exports: [VendorsService],
})
export class VendorsModule {}
