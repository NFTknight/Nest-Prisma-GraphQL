import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { CategoriesService } from 'src/categories/categories.service';
import { Vendor } from 'src/vendors/models/vendor.model';
import { Category } from 'src/categories/models/category.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productService: ProductsService,
    private readonly vendorService: VendorsService,
    private readonly categoriesService: CategoriesService
  ) {}

  @Query(() => Product)
  getProduct(@Args('id') id: string): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @Query(() => [Product])
  getProducts(@Args('vendorId', { nullable: true }) vendorId?: string) {
    return this.productService.getProducts(vendorId);
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
}
