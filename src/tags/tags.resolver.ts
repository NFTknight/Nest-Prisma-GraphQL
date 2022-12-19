import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './models/tag.model';
import { TagsService } from './tags.service';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PrismaService } from 'nestjs-prisma';
import { Product } from 'src/products/models/product.model';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(
    private readonly tagsService: TagsService,
    private readonly vendorService: VendorsService,
    private readonly prisma: PrismaService
  ) {}

  @Query(() => Tag)
  getTag(@Args('id') id: string): Promise<Tag> {
    return this.tagsService.getTag(id);
  }

  @Query(() => [Tag])
  async getTags(
    @Args('vendorId', { nullable: true }) vendorId?: string,
    @Args('pagination', { nullable: true }) pg?: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder?: SortOrder
  ) {
    return this.tagsService.getTags(vendorId, pg, sortOrder);
  }

  @Query(() => [Tag])
  async getTagsByProduct(@Args('productId') productId: string) {
    return this.tagsService.getTagsByProduct(productId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tag)
  createTag(@Args('data') data: CreateTagInput): Promise<Tag> {
    return this.tagsService.createTag(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tag)
  updateTag(
    @Args('id') id: string,
    @Args('data') data: UpdateTagInput
  ): Promise<Tag> {
    return this.tagsService.updateTag(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tag)
  deleteTag(@Args('id') id: string): Promise<Tag> {
    return this.tagsService.deleteTag(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() tag: Tag): Promise<Vendor> {
    return this.vendorService.getVendor(tag.vendorId);
  }

  @ResolveField('products', () => [Product])
  products(@Parent() tag: Tag): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        tags: {
          some: {
            id: tag.id,
          },
        },
      },
    });
  }

  @Query(() => [String])
  getTagAvailabilityByDate(
    @Args('tagId') tagId: string,
    @Args('date') date: string,
    @Args('productId') productId: string
  ) {
    // TODO
    // Return all avaible slots for this tag given bookings and working hours of the tag
    return [];
  }
}
