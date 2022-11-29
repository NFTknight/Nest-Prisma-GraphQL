import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../models/product.model';

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

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { slug } });

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
    const { vendorId, categoryId, ...rest } = data;

    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(vendorId);

    // if vendor exists we can successfully create the product.
    const prod = await this.prisma.product.create({
      data: {
        ...rest,
        vendor: { connect: { id: vendorId } },
        category: { connect: { id: categoryId } },
      },
    });
    return prod;
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
