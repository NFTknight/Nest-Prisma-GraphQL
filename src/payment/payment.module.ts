import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'nestjs-prisma';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  providers: [PaymentService, PaymentResolver],
  imports: [HttpModule, PrismaModule, VendorsModule],
  exports: [PaymentService],
})
export class PaymentModule {}
