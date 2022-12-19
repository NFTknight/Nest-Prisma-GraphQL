import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType, AttendanceType } from 'prisma/prisma-client';
import { ProductVariantInput } from './variant.input';

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
  categoryId?: string;

  @Field()
  active?: boolean;

  @Field(() => Int)
  minPreorderDays?: number;

  @Field()
  variants?: string[];

  @Field(() => Int)
  noOfSeats?: number;

  @Field(() => Int)
  workshopBookedCount?: number;

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
