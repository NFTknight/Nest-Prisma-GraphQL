import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateVariantInput } from './dto/create-variant.input';

@Injectable()
export class VariantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async createVariant(data: CreateVariantInput): Promise<any> {
    return this.prisma.variantModel.create({
      data: data,
    });
  }
}
