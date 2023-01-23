import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RolesGuard } from 'src/auth/gql-signup.guard';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './models/analytics.models';

@Resolver(() => String)
export class AnalyticsResolver {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService
  ) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', Role.ADMIN)
  @Query(() => Analytics)
  getAnalytics(@Args('vendorId') id: string): Promise<Analytics> {
    return this.analyticsService.getAnalytics(id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', Role.ADMIN)
  @Query(() => Int)
  numberOfDroppedBaskets(@Args('vendorId') id: string): Promise<number> {
    return this.analyticsService.numberOfDroppedBaskets(id);
  }
}
