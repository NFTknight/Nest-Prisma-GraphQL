import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class VariantInput {
  @Field()
  identifier: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field(() => Int)
  @IsNotEmpty()
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  price: number;
}
