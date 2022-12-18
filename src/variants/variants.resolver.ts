import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantModel)
  createVariant(@Args('data') data: CreateVariantInput) {
    return this.variantService.createVariant(data);
  }

  @Query(() => [VariantModel])
  getVariants(@Args('vendorId') vendorId: string) {
    return this.variantService.getVariants(vendorId);
  }

  @Query(() => VariantModel)
  getVariant(@Args('id') id: string) {
    return this.variantService.getVariant(id);
  }
}
