import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from 'src/auth/password.service';
import { SmsModule } from 'src/sms/sms.module';
import { VendorsService } from 'src/vendors/vendors.service';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { VendorsModule } from 'src/vendors/vendors.module';

@Module({
  imports: [SmsModule, VendorsModule, SendgridModule],
  providers: [UsersResolver, UsersService, PasswordService, VendorsService],
})
export class UsersModule {}
