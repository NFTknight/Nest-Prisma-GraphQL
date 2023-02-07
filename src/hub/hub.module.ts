import { Module } from '@nestjs/common';
import { HubService } from './services/hub.service';
import { HubResolver } from './hub.resolver';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/auth/password.service';

@Module({
  imports: [],
  providers: [HubResolver, HubService, JwtService, PasswordService],
  exports: [HubService],
})
export class HubModule {}
