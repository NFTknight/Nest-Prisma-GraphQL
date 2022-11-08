import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateCouponInput {
  @Field()
  code: string;

  @Field(() => Float, { nullable: false })
  discount: number;

  @Field()
  vendorId: string;

  @Field()
  active: boolean;
}
