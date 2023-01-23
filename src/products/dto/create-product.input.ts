import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductType, AttendanceType } from '@prisma/client';
import { VariantInput } from './variant.input';
import { LocationInput } from './location.input';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  slug: string;

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

  @Field(() => [String], { nullable: true })
  images?: string[];

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

  @Field(() => Int, { nullable: true })
  minPreorderDays?: number;

  @Field(() => [VariantInput])
  variants?: VariantInput[];

  @Field(() => Int)
  noOfSeats?: number;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => Int)
  sortOrder?: number;

  @Field(() => AttendanceType, { nullable: true })
  attendanceType?: AttendanceType;

  meetingLink?: string;

  @Field(() => LocationInput, { nullable: true })
  location?: LocationInput;

  endTime?: boolean;

  customerLocation?: boolean;

  @Field(() => Int)
  duration?: number;

  @Field(() => String, { nullable: true })
  formId?: string;

  startDate?: Date;
  endDate?: Date;
}
