import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Review extends BaseModel {
  @Field(() => String)
  name: string;

  @Field(() => Float)
  rating: number;

  @Field(() => String)
  review: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  variantTitle: string;
}
