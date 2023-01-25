import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeliveryMethodAnalytics {
  @Field(() => Int)
  SMSA: number;

  @Field(() => Int)
  MANDOOB: number;

  @Field(() => Int)
  PICKUP: number;
}
