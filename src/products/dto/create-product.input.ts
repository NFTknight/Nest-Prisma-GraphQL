import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { ProductType } from 'prisma/prisma-client';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
import { VariantInput } from './variant.input';
import { VariationOptionInput } from './variation-option.input';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  slug: string;

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

  @Field(() => [VariationOptionInput], { nullable: true })
  variationOptions: VariationOptionInput[];

  @Field(() => [VariantInput], { nullable: true })
  variants: VariantInput[];

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];

  @Field(() => Int)
  noOfSeats?: number;

  @Field(() => [String], { nullable: true })
  tagIds: string[];

  itemsInStock?: number;

  @Field(() => Int)
  sortOrder: number;
}
