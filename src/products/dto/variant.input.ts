import { InputType, Field, Float } from '@nestjs/graphql';

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

  @Field(() => Float)
  price: number;

  @Field()
  image?: string;

  @Field()
  images?: string[];
}
