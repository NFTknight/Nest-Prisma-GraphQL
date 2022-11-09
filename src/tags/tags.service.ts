import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './models/tag.model';

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

  getTags(vendorId?: string): Promise<Tag[]> {
    const where: Partial<Tag> = {};
    if (vendorId) where.vendorId = vendorId;
    return this.prisma.tag.findMany({ where });
  }

  async createTags(data: CreateTagInput): Promise<Tag> {
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);
    // if vendor exists we can successfully create the category.
    return this.prisma.tag.create({ data });
  }

  async updateTag(id: string, data: UpdateTagInput): Promise<Tag> {
    return this.prisma.tag.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteTag(id: string): Promise<Tag> {
    return await this.prisma.tag.delete({ where: { id } });
  }
}
