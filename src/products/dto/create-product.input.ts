import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
import { VariantInput } from './variant.input';
import { VariationOptionInput } from './variation-option.input';
import { ProductType, AttendanceType } from '@prisma/client';

@InputType()
export class CreateProductInput {
  sku?: string;

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

  @Field(() => ProductType)
  @IsNotEmpty()
  type: ProductType;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field()
  @IsNotEmpty()
  active: boolean;

  @Field(() => Int)
  minPreorderDays?: number;

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

  startDate?: Date;
  endDate?: Date;
}
