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
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './models/category.model';
import { CategoriesService } from './categories.service';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly vendorService: VendorsService
  ) {}

  @Query(() => Category)
  getCategory(@Args('id') id: string): Promise<Category | null> {
    return this.categoriesService.getCategory(id);
  }

  @Query(() => [Category])
  getCategories(
    @Args('vendorId') vendorId: string,
    @Args('active', { nullable: true }) active: boolean | null,
    @Args('pagination', { nullable: true }) pg?: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder?: SortOrder
  ) {
    return this.categoriesService.getCategories(
      vendorId,
      active,
      pg,
      sortOrder
    );
  }

  @Mutation(() => Category)
  createCategory(@Args('data') data: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.createCategory(data);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id') id: string,
    @Args('data') data: UpdateCategoryInput
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, data);
  }

  @Mutation(() => Category)
  deleteCategory(@Args('id') id: string): Promise<Category> {
    return this.categoriesService.deleteCategory(id);
  }

  @ResolveField('Vendor')
  Vendor(@Parent() category: Category): Promise<Vendor> {
    return this.vendorService.getVendor(category.vendorId);
  }
}
