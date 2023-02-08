import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubscriberPlan {
  @Field({ nullable: true })
  _id: string;

  @Field(() => Int, { nullable: true })
  vendor: number;
}
