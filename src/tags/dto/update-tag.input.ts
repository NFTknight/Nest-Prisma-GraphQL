import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTagInput } from './create-tag.input';

@InputType()
export class UpdateTagInput extends PartialType(
  OmitType(CreateTagInput, ['vendorId'])
) {}
