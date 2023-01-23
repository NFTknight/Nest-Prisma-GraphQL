import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { SubscriptionPlan, SubscriptionType } from '@prisma/client';
import './vendor.enum';

@ObjectType()
export class AddOn {
  feature: string;
  @Field(() => Float)
  price: number;
}
@ObjectType()
export class AddOnsList {
  @Field(() => [AddOn])
  list: AddOn[];
  @Field(() => Float)
  totalMonthly: number;
  @Field(() => Float)
  totalYearly: number;
}

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

  @Field(() => AddOnsList, { nullable: true })
  addOns: AddOnsList;
}
