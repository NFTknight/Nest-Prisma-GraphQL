import { IsEnum } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType } from 'prisma/prisma-client';
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
  image?: string;

  @Field()
  @IsEnum(ProductType)
  type: ProductType;

  @Field()
  vendorId?: string;

  @Field()
  categoryId?: string;

  @Field()
  active?: boolean;

  @Field()
  minPreorderDays?: number;

  @Field(() => Int)
  price?: number;

  @Field(() => Int)
  price_ar?: number;
}
