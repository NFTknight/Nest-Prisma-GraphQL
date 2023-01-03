import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Analytics } from './models/analytics.models';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(vendorId): Promise<Analytics> {
    const response = {
      deliveryMethods: {
        MANDOOB: 0,
        SMSA: 0,
        PICKUP: 0,
      },
      paymentMethods: {
        CASH: 0,
        ONLINE: 0,
        BANK_TRANSFER: 0,
        STORE: 0,
      },
      numberOfOrders: 0,
    };

    const deliverMethod = await this.prisma.order.groupBy({
      where: { vendorId },
      by: ['deliveryMethod'],
      _count: {
        deliveryMethod: true,
      },
    });
    const numberOfOrders = await this.prisma.order.count({
      where: { vendorId },
    });

    const paymentMethod = await this.prisma.order.groupBy({
      where: { vendorId },
      by: ['paymentMethod'],
      _count: {
        paymentMethod: true,
      },
    });

    if (deliverMethod) {
      deliverMethod.map((group) => {
        response.deliveryMethods[group.deliveryMethod] =
          group._count.deliveryMethod;
      });
    }

    if (paymentMethod) {
      paymentMethod.map((group) => {
        response.paymentMethods[group.paymentMethod] =
          group._count.paymentMethod;
      });
    }
    if (numberOfOrders) {
      response['numberOfOrders'] = numberOfOrders;
    }

    return response;
  }

  async numberOfDroppedBaskets(vendorId): Promise<number> {
    const subtractHour = (date, hour) => {
      date.setHours(date.getHours() - hour);
      return date;
    };
    const numberOfDroppedBaskets = await this.prisma.cart.count({
      where: {
        AND: [
          { vendorId },
          {
            createdAt: { lte: subtractHour(new Date(), 24) },
          },
        ],
      },
    });
    return numberOfDroppedBaskets;
  }
  async getRevenueAndTopProduct(vendorId: string) {
    const revenue = await this.prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: { vendorId },
    });

    const mostSellingProduct = await this.prisma.order.aggregateRaw({
      pipeline: [
        { $unwind: '$items' },
        { $match: { vendorId: { $eq: { $oid: vendorId } } } },
        { $sortByCount: '$items.productId' },
        { $limit: 1 },
      ],
    });
    const id = mostSellingProduct[0]?.['_id']?.['$oid'];
    const product = await this.prisma.product.findUnique({ where: { id } });

    return {
      revenue: revenue._sum.totalPrice,
      product,
    };
  }
}
