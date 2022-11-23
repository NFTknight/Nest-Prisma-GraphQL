import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  productVariant?: string;

  @Field()
  cartId?: string;

  @Field(() => Int)
  quantity?: number;

  @Field()
  @IsNotEmpty()
  vendorId: string;
}
