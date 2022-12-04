import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [PaymentService, PaymentResolver],
  imports: [HttpModule],
})
export class PaymentModule {}
