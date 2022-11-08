import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCouponInput {
  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  active?: boolean;
}
