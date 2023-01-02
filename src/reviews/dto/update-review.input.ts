import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  review: string;

  @Field(() => Float, { nullable: true })
  rating: number;

  @Field(() => String, { nullable: true })
  variantTitle: string;

  @Field(() => String, { nullable: true })
  productId: string;
}
