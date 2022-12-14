import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Variant {
  identifier: string;
  title: string;
  title_ar: string;

  @Field(() => [String], { nullable: true })
  options?: string[];

  @Field(() => [String], { nullable: true })
  options_ar?: string[];

  @Field(() => String)
  image: string;

  @Field(() => Float)
  price: number;
  sku: string;
}
