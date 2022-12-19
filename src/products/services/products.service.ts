import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductValidator } from 'src/utils/validation';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product, Prisma } from '@prisma/client';
import { omit } from 'lodash';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getProduct(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NotFoundException('Product Not Found.');

    return product;
  }

  async getProducts(vendorId: string): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({ where: { vendorId } });
    } catch (err) {
      console.log('Err => ', err);
    }
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const error = CreateProductValidator(data);
    if (error) throw new BadRequestException(error);

    const { vendorId, categoryId, variants, ...rest } = data;

    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(vendorId);

    let vars: any = [];
    if (variants && variants.length > 0) {
      vars = await this.prisma.variantModel.findMany({
        where: { id: { in: variants } },
      });
    }

    // if vendor exists we can successfully create the product.
    const prod = await this.prisma.product.create({
      data: {
        ...rest,
        variants: { set: vars.map((v) => omit(v, 'vendorId')) },
        vendor: { connect: { id: vendorId } },
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });
    return prod;
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const { categoryId, variants, ...restData } = data;
    const updateData: Prisma.ProductUpdateArgs['data'] = {
      ...restData,
    };

    if (categoryId) {
      updateData.category = { connect: { id: categoryId } };
    }

    if (variants && variants.length > 0) {
      const vars = await this.prisma.variantModel.findMany({
        where: { id: { in: variants } },
      });
      updateData.variants = { set: vars.map((v) => omit(v, 'vendorId')) };
    }

    return this.prisma.product.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return await this.prisma.product.delete({ where: { id } });
  }
}
