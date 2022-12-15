import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { VendorsService } from 'src/vendors/vendors.service';
import { CreateVariantInput } from './dto/create-variant.input';
import { VariantModel } from './models/variant.model';
import { VariantsService } from './variants.service';

@Resolver(() => VariantModel)
export class VariantsResolver {
  constructor(
    private readonly tagsService: VariantsService,
    private readonly vendorService: VendorsService
  ) {}

  @Mutation(() => VariantModel)
  createVariant(@Args('data') data: CreateVariantInput): Promise<VariantModel> {
    return this.tagsService.createVariant(data);
  }
}
