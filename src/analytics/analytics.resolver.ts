import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './models/analytics.models';

@Resolver(() => String)
export class AnalyticsResolver {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService
  ) {}

  @Query(() => Analytics)
  getAnalytics(@Args('vendorId') id: string): Promise<Analytics> {
    return this.analyticsService.getAnalytics(id);
  }

  @Query(() => Int)
  numberOfDroppedBaskets(@Args('vendorId') id: string): Promise<number> {
    return this.analyticsService.numberOfDroppedBaskets(id);
  }
}
