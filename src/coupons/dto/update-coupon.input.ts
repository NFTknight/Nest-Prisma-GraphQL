import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UpdateCouponInput {
  @Field()
  code?: string;

  @Field(() => Float, { nullable: false })
  discount?: number;

  @Field()
  active?: boolean;
}
