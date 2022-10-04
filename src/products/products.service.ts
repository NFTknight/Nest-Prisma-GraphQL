import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './models/product.model';
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

  async getProducts(vendorId?: string): Promise<Product[]> {
    const where: Partial<Product> = {};
    if (vendorId) where.vendorId = vendorId;

    return this.prisma.product.findMany({ where });
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    // if the vendor does not exist, this function will throw an error.
    const { vendorId, categoryId, ...rest } = data;
    await this.vendorService.getVendor(vendorId);
    // if vendor exists we can successfully create the product.
    console.log('CREATE PROD');
    try {
      const prod = await this.prisma.product.create({
        data: {
          ...rest,
          vendor: { connect: { id: data.vendorId } },
          category: { connect: { id: data.vendorId } },
        },
      });
      console.log('');
      console.log('Prod => ', prod);
      return prod;
    } catch (err) {
      console.log('ERRR');
      console.log('Err =>', err);
    }
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    if (data.vendorId) {
      // if the vendor does not exist, this function will throw an error.
      await this.vendorService.getVendor(data.vendorId);
    }

    return this.prisma.product.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return await this.prisma.product.delete({ where: { id } });
  }
}
