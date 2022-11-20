import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { ProductAttributeInput } from './product-attribute.input';
import { ProductType } from 'prisma/prisma-client';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
@InputType()
export class UpdateProductVariantInput {
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
  type?: ProductType;

  @Field()
  vendorId?: string;

  @Field()
  categoryId?: string;

  @Field()
  active?: boolean;

  @Field()
  minPreorderDays?: number;

  @Field(() => Float)
  price?: number;

  @Field(() => [ProductAttributeInput])
  attributes?: ProductAttributeInput[];

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];

  @Field(() => Int)
  noOfSeats?: number;
  itemsInStock?: number;
}
