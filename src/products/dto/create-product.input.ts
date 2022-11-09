import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { ProductType } from 'prisma/prisma-client';
import { ProductAttributeInput } from './product-attribute.input';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  sku: string;

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
  previewImage: string;

  @Field()
  @IsNotEmpty()
  image: string;

  @Field()
  @IsNotEmpty()
  type: ProductType;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  @IsNotEmpty()
  categoryId: string;

  @Field()
  @IsNotEmpty()
  active: boolean;

  @Field()
  @IsNotEmpty()
  minPreorderDays: number;

  @Field(() => Float)
  @IsNotEmpty()
  price: number;

  @Field(() => Float)
  @IsNotEmpty()
  price_ar: number;

  @Field(() => [ProductAttributeInput])
  @IsNotEmpty()
  attributes?: ProductAttributeInput[];

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];

  @Field(() => Int)
  noOfSeats?: number;
}
