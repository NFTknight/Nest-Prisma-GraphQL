import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { VariantOptionsInput } from './variant-options.input';

@InputType()
export class CreateVariantInput {
  @Field()
  id?: string;

  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  vendorId: string;

  @Field(() => [VariantOptionsInput])
  options?: VariantOptionsInput[];
}
