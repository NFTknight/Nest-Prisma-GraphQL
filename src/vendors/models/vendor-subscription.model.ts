import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { SubscriptionPlan, SubscriptionType } from '@prisma/client';
import './vendor.enum';

@ObjectType()
export class VendorSubscription {
  @Field(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Field(() => Float)
  price: number;

  @Field(() => SubscriptionType)
  type: SubscriptionType;

  @Field(() => Int)
  freeTimeLeft: number;

  @Field()
  createdAt: Date;
}
