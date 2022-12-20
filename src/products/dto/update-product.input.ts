import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType(
  OmitType(CreateProductInput, ['vendorId'])
) {}
