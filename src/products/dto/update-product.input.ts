import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType, AttendanceType } from 'prisma/prisma-client';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
import { UpdateVariantInput } from './variant.input';
import { CreateVariantInput } from '../../variants/dto/create-variant.input';
@InputType()
export class UpdateProductInput {
  @Field()
  slug?: string;

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

  @Field(() => [CreateVariantInput], { nullable: true })
  variants: CreateVariantInput[];

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

  startDate?: Date;
  endDate?: Date;
}
