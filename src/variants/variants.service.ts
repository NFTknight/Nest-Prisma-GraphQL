import { Injectable } from '@nestjs/common';
import { VariantModel } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateVariantInput } from './dto/create-variant.input';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVariant(data: CreateVariantInput): Promise<VariantModel> {
    return this.prisma.variantModel.create({
      data: data,
    });
  }

  async getVariants(vendorId: string): Promise<Array<VariantModel>> {
    return this.prisma.variantModel.findMany({
      where: { vendorId: vendorId },
    });
  }

  async getVariant(id: string): Promise<VariantModel> {
    return this.prisma.variantModel.findUnique({ where: { id: id } });
  }
}
