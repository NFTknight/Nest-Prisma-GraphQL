import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AnalyticsResolver } from './analytics.resolver';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [],
  providers: [AnalyticsResolver, AnalyticsService, JwtService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
