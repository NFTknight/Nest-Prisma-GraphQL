import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateVariantInput } from './dto/create-variant.input';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVariant(data: CreateVariantInput): Promise<any> {
    return this.prisma.variantModel.create({
      data: data,
    });
  }

  async getVariants(vendorId: string): Promise<any> {
    return this.prisma.variantModel.findMany({
      where: { vendorId: vendorId },
    });
  }
}
