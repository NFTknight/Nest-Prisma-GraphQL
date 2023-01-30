import { Role } from '@prisma/client';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { RolesGuard } from 'src/auth/gql-signup.guard';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { HubService } from './services/hub.service';
import { ProductFilterInput } from 'src/common/filter/filter.input';
import { GetProductArgs } from './dto/product';
import { PaginatedProducts } from 'src/products/models/paginated-products.model';

@Resolver('hub')
export class HubResolver {
  constructor(private readonly hubService: HubService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', Role.AGENT)
  @Query(() => PaginatedProducts)
  getProductsForHub(
    @Args('vendorId', { nullable: true }) vendorId: string,
    @Args('categoryId', { nullable: true }) categoryId: string,
    @Args('pagination', { nullable: true }) pg: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder: SortOrder,
    @Args('filter', { nullable: true }) filter: ProductFilterInput
  ): Promise<PaginatedProducts> {
    const data: GetProductArgs = {
      vendorId,
      categoryId,
      pg,
      sortOrder,
      filter,
    };
    return this.hubService.getProducts(data);
  }
}
