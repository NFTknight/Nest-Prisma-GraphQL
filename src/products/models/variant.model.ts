import { Field, Float, ObjectType } from '@nestjs/graphql';
import { VariantOption } from '@prisma/client';

@ObjectType()
export class Variant implements VariantOption {
  @Field({ nullable: true })
  default: boolean;

  @Field()
  title: string;

  @Field()
  title_ar: string;

  @Field()
  sku: string;

  @Field(() => Float)
  price: number;

  @Field({ defaultValue: 1 })
  quantity: number;

  @Field(() => String, { nullable: true })
  image: string;

  // removing temporarily
  // @Field(() => [String], { nullable: true })
  // images: string[];
}
