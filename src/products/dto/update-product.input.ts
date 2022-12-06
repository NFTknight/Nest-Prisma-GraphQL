import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { ProductType, AttendanceType } from 'prisma/prisma-client';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
import { VariantInput } from './variant.input';
import { VariationOptionInput } from './variation-option.input';

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
  image?: string;

  @Field(() => ProductType)
  type?: ProductType;

  @Field()
  vendorId?: string;

  @Field()
  categoryId?: string;

  @Field()
  active?: boolean;

  @Field(() => Int)
  minPreorderDays?: number;

  @Field(() => Float)
  price?: number;

  @Field(() => [VariationOptionInput], { nullable: true })
  variationOptions: VariationOptionInput[];

  @Field(() => [VariantInput], { nullable: true })
  variants: VariantInput[];

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];

  @Field(() => Int)
  noOfSeats?: number;

  @Field(() => [String], { nullable: true })
  tagIds?: string[];

  @Field(() => Int)
  itemsInStock?: number;

  @Field(() => Int)
  sortOrder?: number;

  @Field(() => AttendanceType, { nullable: true })
  attendanceType?: AttendanceType;

  meetingLink?: string;

  location?: string;

  endTime?: boolean;

  customerLocation?: boolean;

  @Field(() => Int)
  duration?: number;
}
