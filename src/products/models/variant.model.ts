import { Field, ObjectType } from '@nestjs/graphql';
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

  @Field()
  price: number;

  @Field()
  image: string;
}
