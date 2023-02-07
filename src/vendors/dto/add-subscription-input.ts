import { InputType, Field } from '@nestjs/graphql';
import { SubscriptionPlan, SubscriptionType } from '@prisma/client';

@InputType()
export class AddSubscriptionInput {
  @Field(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Field(() => SubscriptionType)
  type: SubscriptionType;
}

@InputType()
export class AddSubscriptionInputWithPrice extends AddSubscriptionInput {
  @Field()
  price: number;
}
