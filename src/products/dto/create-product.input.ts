import { IsEnum, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType } from 'prisma/prisma-client';
@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  title_ar: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  description_ar: string;

  @Field()
  @IsNotEmpty()
  image: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(ProductType)
  type: ProductType;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  @IsNotEmpty()
  active: boolean;

  @Field()
  @IsNotEmpty()
  minPreorderDays: number;

  @Field(() => Int)
  @IsNotEmpty()
  price: number;

  @Field(() => Int)
  @IsNotEmpty()
  price_ar: number;
}
