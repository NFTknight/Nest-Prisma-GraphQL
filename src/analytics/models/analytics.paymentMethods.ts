import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethodAnalytics {
  @Field(() => Int)
  CASH: number;

  @Field(() => Int)
  ONLINE: number;

  @Field(() => Int)
  BANK_TRANSFER: number;

  @Field(() => Int)
  STORE: number;
}
