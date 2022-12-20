import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(
  OmitType(CreateCategoryInput, ['vendorId'])
) {}
