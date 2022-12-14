import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class VariantInput {
  @Field()
  identifier: string;

  @Field()
  title: string;

  @Field()
  title_ar?: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field()
  @IsNotEmpty()
  image: string;

  @Field()
  options?: string[];

  @Field()
  options_ar?: string[];

  @Field(() => Float)
  @IsNotEmpty()
  price: number;
}

@InputType()
export class UpdateVariantInput {
  @Field()
  identifier?: string;

  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  sku?: string;

  @Field()
  image?: string;

  @Field()
  options?: string[];

  @Field()
  options_ar?: string[];

  @Field(() => Float)
  price?: number;
}
