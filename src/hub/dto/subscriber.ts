import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SubscriberCountFilterInputForHub {
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
