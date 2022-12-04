import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingResolver } from './shipping.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ShippingService, ShippingResolver],
  imports: [HttpModule],
})
export class ShippingModule {}
