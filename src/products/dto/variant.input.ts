import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class VariantInput {
  @Field()
  default?: boolean;

  @Field()
  title: string;

  @Field()
  title_ar: string;

  @Field()
  sku: string;

  @Field(() => Int)
  quantity?: number;

  @Field(() => Float)
  price: number;

  @Field()
  image?: string;

  // removing temporarily
  // @Field(() => [String], { nullable: true })
  // images?: string[];
}
