import { Module } from '@nestjs/common';
import { HubService } from './services/hub.service';
import { HubResolver } from './hub.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [HubResolver, HubService, JwtService],
  exports: [HubService],
})
export class HubModule {}
