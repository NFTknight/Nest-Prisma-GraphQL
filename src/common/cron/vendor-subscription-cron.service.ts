import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class VendorSubscriptionService {
  private readonly logger = new Logger(VendorSubscriptionService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.prisma.vendor.updateMany({
      where: {
        subscription: {
          is: {
            freeTimeLeft: { gt: 0 },
          },
        },
      },
      data: {
        subscription: {
          upsert: {
            set: null,
            update: {
              freeTimeLeft: { decrement: 1 },
            },
          },
        },
      },
    });
    this.logger.debug('Called every day at midnight');
  }
}
