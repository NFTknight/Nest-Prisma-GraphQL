import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Variant {
  @Field()
  default?: boolean;

  @Field()
  title: string;

  @Field()
  title_ar: string;

  @Field()
  sku: string;

  @Field()
  price: number;

  @Field()
  image?: string;
}
