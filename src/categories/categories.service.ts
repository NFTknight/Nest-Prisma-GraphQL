import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './models/category.model';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { Product } from '@prisma/client';
import { PaginatedCategories } from './models/paginated-categories.model';
import { throwNotFoundException } from 'src/utils/validation';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getCategory(id: string): Promise<Category> {
    if (!id) return null;
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    throwNotFoundException(category, 'Category');

    return category;
  }

  async getCategories(
    vendorId: string,
    active: boolean | null,
    pg?: PaginationArgs,
    sortOrder?: SortOrder
  ): Promise<PaginatedCategories> {
    const { skip, take } = getPaginationArgs(pg);

    if (!vendorId) throw new BadRequestException('Vendor Id is required');

    const where = {
      vendorId,
    };

    let orderBy = {};

    if (sortOrder) {
      orderBy[sortOrder.field] = sortOrder.direction;
    } else {
      orderBy = {
        sortOrder: 'asc',
      };
    }

    if (typeof active === 'boolean') {
      where['active'] = active;
    }

    const res = await this.prisma.$transaction([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { products: true },
      }),
    ]);

    return { totalCount: res[0], list: res[1] };
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);
    // if vendor exists we can successfully create the category.

    return this.prisma.category.create({ data });
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteCategory(id: string): Promise<Category> {
    return await this.prisma.category.delete({ where: { id } });
  }

  async getProducts(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        categoryId,
      },
    });
  }
}
