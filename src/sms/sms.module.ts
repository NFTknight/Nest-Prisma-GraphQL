import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Module({
  imports: [HttpModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
