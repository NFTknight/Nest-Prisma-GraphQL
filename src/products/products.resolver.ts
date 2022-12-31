import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { CategoriesService } from 'src/categories/categories.service';
import { Form, Prisma, Role, Vendor } from '@prisma/client';
import { Category } from 'src/categories/models/category.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './models/product.model';
import { ProductsService } from './services/products.service';
import { PaginatedProducts } from './models/paginated-products.model';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { PrismaService } from 'nestjs-prisma';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { ProductFilterInput } from 'src/common/filter/filter.input';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/models/tag.model';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { FormService } from 'src/forms/forms.service';
import { RolesGuard } from 'src/auth/gql-signup.guard';
@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductsService,
    private readonly vendorService: VendorsService,
    private readonly categoriesService: CategoriesService,
    private readonly tagService: TagsService,
    private readonly formService: FormService
  ) {}

  @Query(() => Product)
  getProduct(@Args('id') id: string): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @Query(() => PaginatedProducts)
  getProducts(
    @Args('vendorId') vendorId: string,
    @Args('categoryId', { nullable: true }) categoryId: string,
    @Args('pagination', { nullable: true }) pg: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder: SortOrder,
    @Args('filter', { nullable: true }) filter: ProductFilterInput
  ): Promise<PaginatedProducts> {
    return this.productService.getProducts(
      vendorId,
      categoryId,
      pg,
      sortOrder,
      filter
    );
  }

  @Query(() => PaginatedProducts)
  getAllProducts(
    @Args('pagination', { nullable: true }) pg: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder: SortOrder
  ): Promise<PaginatedProducts> {
    return this.productService.getAllProducts(pg, sortOrder);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  createProduct(@Args('data') data: CreateProductInput): Promise<Product> {
    return this.productService.createProduct(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  updateProduct(
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput
  ): Promise<Product> {
    return this.productService.updateProduct(id, data);
  }

  @UseGuards(GqlAuthGuard)
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

  @ResolveField('tags', () => [Tag], { nullable: true })
  tags(@Parent() product: Product): Promise<Tag[]> {
    return this.tagService.getTagsByProduct(product.id);
  }
  @ResolveField('form')
  form(@Parent() product: Product): Promise<Form> {
    return this.formService.getForm(product.formId);
  }
}
