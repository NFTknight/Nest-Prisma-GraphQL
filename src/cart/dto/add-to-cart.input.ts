import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class Time {
  startTime: Date;
  endTime: Date;
}

@InputType()
export class AddToCartInput {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field({ nullable: true })
  productVariant?: string;

  @Field({ nullable: true })
  cartId?: string;

  @Field(() => Int)
  quantity?: number;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  tagId?: string;

  @Field(() => [Time])
  slots?: Time[];
}
