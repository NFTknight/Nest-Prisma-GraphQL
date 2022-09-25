import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput {
  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  description?: string;

  @Field()
  description_ar?: string;

  @Field()
  vendorId?: string;

  @Field()
  active?: boolean;

  @Field()
  minPreorderDays?: number;

  @Field(() => Int)
  price?: number;

  @Field(() => Int)
  price_ar?: number;
}
