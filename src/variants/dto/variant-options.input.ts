import { InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Field } from '@nestjs/graphql';
@InputType()
export class VariantOptionsInput {
  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  sku?: string;

  @Field()
  price?: number;

  @Field()
  image?: string;
}
