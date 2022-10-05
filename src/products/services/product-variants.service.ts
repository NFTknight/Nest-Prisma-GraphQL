import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductVariantInput } from '../dto/create-product-variant.input';
import { UpdateProductVariantInput } from '../dto/update-product-variant.input';
import { ProductVariant } from '../models/product-variant.model';
@Injectable()
export class ProductVariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductVariant(id: string): Promise<ProductVariant> {
    const prodVariant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!prodVariant) throw new NotFoundException('Product Not Found.');

    return prodVariant;
  }

  async getProductVariants(productId?: string): Promise<ProductVariant[]> {
    const where: Partial<ProductVariant> = {};
    if (productId) where.productId = productId;

    const prodVariants = await this.prisma.productVariant.findMany({ where });
    return prodVariants;
  }

  async createProductVariant(
    data: CreateProductVariantInput
  ): Promise<ProductVariant> {
    const prod = await this.prisma.productVariant.create({
      data,
    });
    return prod;
  }

  async updateProductVariant(
    id: string,
    data: UpdateProductVariantInput
  ): Promise<ProductVariant> {
    return this.prisma.productVariant.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteProductVariant(id: string): Promise<ProductVariant> {
    return await this.prisma.productVariant.delete({ where: { id } });
  }
}
