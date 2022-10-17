import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductVariantInput } from '../dto/create-product-variant.input';
import { UpdateProductVariantInput } from '../dto/update-product-variant.input';
import { ProductVariant } from '../models/product-variant.model';
import { ProductVariantsService } from '../services/product-variants.service';

@Resolver(() => ProductVariant)
export class ProductVariantsResolver {
  constructor(
    private readonly productVariantsService: ProductVariantsService
  ) {}

  @Query(() => ProductVariant)
  getProductVariant(@Args('id') id: string): Promise<ProductVariant> {
    return this.productVariantsService.getProductVariant(id);
  }

  @Query(() => [ProductVariant])
  getProductVariants(
    @Args('productId', { nullable: true }) productId?: string
  ) {
    return this.productVariantsService.getProductVariants(productId);
  }

  @Mutation(() => ProductVariant)
  createProductVariant(
    @Args('data') data: CreateProductVariantInput
  ): Promise<ProductVariant> {
    return this.productVariantsService.createProductVariant(data);
  }

  @Mutation(() => ProductVariant)
  updateProductVariant(
    @Args('id') id: string,
    @Args('data') data: UpdateProductVariantInput
  ): Promise<ProductVariant> {
    return this.productVariantsService.updateProductVariant(id, data);
  }

  @Mutation(() => ProductVariant)
  deleteProductVariant(@Args('id') id: string): Promise<ProductVariant> {
    return this.productVariantsService.deleteProductVariant(id);
  }
}
