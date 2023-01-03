import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { AnalyticsService } from './analytics.service';

@Resolver(() => String)
export class AnalyticsResolver {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService
  ) {}

  @Query(() => String)
  getAnalytics(): Promise<string> {
    return this.analyticsService.getAnalytics();
  }
}
