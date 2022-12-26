import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  providers: [PaymentService, PaymentResolver],
  imports: [HttpModule, PrismaModule],
  exports: [PaymentService],
})
export class PaymentModule {}
