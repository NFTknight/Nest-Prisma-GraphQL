import {
  Args,
  Mutation,
  Query,
  Info,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { fieldsMap } from 'graphql-fields-list';
import { CategoriesService } from 'src/categories/categories.service';
// import { Vendor } from 'src/vendors/models/vendor.model';
import { Vendor } from '@prisma/client';
import { Category } from 'src/categories/models/category.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { PaginatedProducts } from '../models/paginated-products.model';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { PrismaService } from 'nestjs-prisma';
import makePrismaSelection from 'src/common/helpers/makePrismaSelection';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { ProductFilterInput } from 'src/common/filter/filter.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductsService,
    private readonly vendorService: VendorsService,
    private readonly categoriesService: CategoriesService
  ) {}

  @Query(() => Product)
  getProduct(@Args('id') id: string): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @Query(() => PaginatedProducts)
  async getProducts(
    @Args('vendorId') vendorId: string,
    @Args('categoryId', { nullable: true }) categoryId: string,
    @Args('pagination', { nullable: true }) pg: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder: SortOrder,
    @Args('filter', { nullable: true }) filter: ProductFilterInput,
    @Info()
    info
  ): Promise<PaginatedProducts> {
    const { skip, take } = getPaginationArgs(pg);

    let orderBy = {};
    if (sortOrder) {
      orderBy[sortOrder.field] = sortOrder.direction;
    } else {
      orderBy = {
        sortOrder: 'asc',
      };
    }

    const where = {
      vendorId,
    };

    if (categoryId) {
      where['categoryId'] = categoryId;
    }

    if (filter && filter?.field) {
      if (filter.field === 'title') {
        where[filter.field] = {
          contains: filter.title.trim(),
          mode: 'insensitive',
        };
      } else if (filter.field === 'type') {
        where[filter.field] = filter.type;
      } else if (filter.field === 'price') {
        where[filter.field] = {
          gte: filter.priceUpperLimit,
          lte: filter.priceLowerLimit,
        };
      } else if (filter.field === 'attendanceType') {
        where[filter.field] = filter.attendanceType;
      }
    }

    const selectedFields = fieldsMap(info, {
      path: 'list',
      skip: ['vendor', 'category'],
    });

    const select = makePrismaSelection(selectedFields);

    const list = await this.prismaService.product.findMany({
      where,
      skip,
      take,
      select,
      orderBy,
    });

    const totalCount = await this.prismaService.product.count({ where });

    return {
      list: list,
      totalCount: totalCount,
    };
  }

  @Mutation(() => Product)
  createProduct(@Args('data') data: CreateProductInput): Promise<Product> {
    return this.productService.createProduct(data);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput
  ): Promise<Product> {
    return this.productService.updateProduct(id, data);
  }

  @Mutation(() => Product)
  deleteProduct(@Args('id') id: string): Promise<Product> {
    return this.productService.deleteProduct(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() product: Product): Promise<Vendor> {
    return this.vendorService.getVendor(product.vendorId);
  }

  @ResolveField('category')
  category(@Parent() product: Product): Promise<Category> {
    return this.categoriesService.getCategory(product.categoryId);
  }

  // @ResolveField('variants')
  // variants(@Parent() product: Product): Promise<ProductVariant[]> {
  //   return this.productVariantsService.getProductVariants(product.id);
  // }
}
