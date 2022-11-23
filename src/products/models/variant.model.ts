import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Variant {
  identifier: string;

  sku: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}
