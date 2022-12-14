import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './models/category.model';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getCategory(id: string): Promise<Category> {
    if (!id) return null;
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException('Category Not Found.');

    return category;
  }

  async getCategories(
    vendorId: string,
    active: boolean | null,
    pg?: PaginationArgs,
    sortOrder?: SortOrder
  ): Promise<Category[]> {
    const { skip, take } = getPaginationArgs(pg);

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
    return this.prisma.category.findMany({
      where,
      skip,
      take,
      orderBy,
    });
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
}
