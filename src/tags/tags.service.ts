import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './models/tag.model';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getTag(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) throw new NotFoundException('Tag Not Found.');

    return tag;
  }

  getTags(
    vendorId?: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder
  ): Promise<Tag[]> {
    const { skip, take } = getPaginationArgs(pg);

    const where = {
      vendorId,
    };
    return this.prisma.tag.findMany({ where, skip, take });
  }

  async getTagsByProduct(productId: string): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: { productIds: { has: productId } },
    });
  }

  async createTag(data: CreateTagInput): Promise<Tag> {
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);
    // if vendor exists we can successfully create the category.
    return this.prisma.tag.create({ data });
  }

  async updateTag(id: string, data: UpdateTagInput): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    const products = await this.prisma.product.findMany({
      where: { vendorId: tag.vendorId },
    });

    if (products.length > 0) {
      for (const product of products) {
        // remove the tag from products that do not have it.
        if (!data.productIds?.includes(product.id)) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              tagIds: { set: product.tagIds.filter((tagId) => tagId !== id) },
            },
          });
        }
        // add the tag to products that do not have it.
        else if (!product.tagIds.includes(id)) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              tagIds: { set: [...product.tagIds, id] },
            },
          });
        }
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteTag(id: string): Promise<Tag> {
    const products = await this.prisma.product.findMany({
      where: { tagIds: { has: id } },
    });

    if (products.length > 0) {
      for (const product of products) {
        await this.prisma.product.update({
          where: { id: product.id },
          data: {
            tagIds: { set: product.tagIds.filter((tagId) => tagId !== id) },
          },
        });
      }
    }

    return await this.prisma.tag.delete({ where: { id } });
  }
}
