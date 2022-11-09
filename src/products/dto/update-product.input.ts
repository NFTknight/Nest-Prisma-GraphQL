import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType } from 'prisma/prisma-client';
import { ProductAttributeInput } from './product-attribute.input';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
@InputType()
export class UpdateProductInput {
  @Field()
  sku?: string;

  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  description?: string;

  @Field()
  description_ar?: string;

  @Field()
  previewImage?: string;

  @Field()
  image?: string;

  @Field()
  type?: ProductType;

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

  @Field(() => [ProductAttributeInput])
  attributes?: ProductAttributeInput[];

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];

  @Field(() => Int)
  noOfSeats?: number;
}
