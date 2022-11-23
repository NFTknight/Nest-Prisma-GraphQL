import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { VariationValueInput } from './variation-value.input';

@InputType()
export class VariationOptionInput {
  @Field()
  key: string;

  @Field()
  @IsNotEmpty()
  key_ar: string;

  @Field(() => [VariationValueInput])
  @IsNotEmpty()
  values: VariationValueInput[];
}
