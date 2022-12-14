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

@Resolver(() => Tag)
export class TagsResolver {
  constructor(
    private readonly tagsService: TagsService,
    private readonly vendorService: VendorsService
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
    try {
      const tags = this.tagsService.getTags(vendorId, pg, sortOrder);

      return tags;
    } catch (err) {
      console.log('ERRR', err);
      return [];
    }
  }

  @Mutation(() => Tag)
  createTag(@Args('data') data: CreateTagInput): Promise<Tag> {
    return this.tagsService.createTags(data);
  }

  @Mutation(() => Tag)
  updateTag(
    @Args('id') id: string,
    @Args('data') data: UpdateTagInput
  ): Promise<Tag> {
    return this.tagsService.updateTag(id, data);
  }

  @Mutation(() => Tag)
  deleteTag(@Args('id') id: string): Promise<Tag> {
    return this.tagsService.deleteTag(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() tag: Tag): Promise<Vendor> {
    return this.vendorService.getVendor(tag.vendorId);
  }
}
