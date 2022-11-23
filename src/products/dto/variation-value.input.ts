import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VariationValueInput {
  @Field()
  value: string;

  @Field()
  @IsNotEmpty()
  value_ar: string;
}
