import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { VendorsService } from 'src/vendors/vendors.service';
import { CreateVariantInput } from './dto/create-variant.input';
import { VariantModel } from './models/variant.model';
import { VariantsService } from './variants.service';

@Resolver(() => VariantModel)
export class VariantsResolver {
  constructor(
    private readonly variantService: VariantsService,
    private readonly vendorService: VendorsService
  ) {}

  @Mutation(() => VariantModel)
  createVariant(@Args('data') data: CreateVariantInput): Promise<VariantModel> {
    return this.variantService.createVariant(data);
  }

  @Query(() => [VariantModel])
  getVariants(@Args('vendorId') vendorId: string): Promise<VariantModel> {
    return this.variantService.getVariants(vendorId);
  }
}
