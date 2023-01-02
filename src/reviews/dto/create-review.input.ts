import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  review: string;

  @Field(() => Float)
  @IsNotEmpty()
  rating: number;

  @Field(() => String)
  @IsNotEmpty()
  variantTitle: string;

  @Field()
  @IsNotEmpty()
  productId: string;
}
