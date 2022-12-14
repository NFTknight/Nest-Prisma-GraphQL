import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from 'src/auth/password.service';
import { SmsModule } from 'src/sms/sms.module';
import { VendorsService } from 'src/vendors/vendors.service';

@Module({
  imports: [SmsModule],
  providers: [UsersResolver, UsersService, PasswordService, VendorsService],
})
export class UsersModule {}
