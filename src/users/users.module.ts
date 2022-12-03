import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from 'src/auth/password.service';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [SmsModule],
  providers: [UsersResolver, UsersService, PasswordService],
})
export class UsersModule {}
