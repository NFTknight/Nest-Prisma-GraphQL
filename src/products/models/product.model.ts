import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import {
  ProductType,
  AttendanceType,
  BadgeType as Btype,
} from 'prisma/prisma-client';
import { Tag } from 'src/tags/models/tag.model';
import './product-type.enum';
import { Variant } from './variant.model';

@ObjectType()
export class BadgeType implements Btype {
  @Field(() => AttendanceType)
  label: AttendanceType;
}
@ObjectType()
export class Product extends BaseModel {
  slug: string;
  title: string;
  title_ar: string;

  description: string;
  description_ar: string;

  @Field(() => ProductType)
  type: ProductType;

  image: string;

  vendorId: string;

  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;

  categoryId?: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  active: boolean;

  @Field(() => Int)
  minPreorderDays?: number;

  @Field(() => [Variant], { nullable: true })
  variants?: Variant[];

  tagIds: string[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => Int)
  noOfSeats?: number;

  @Field(() => Int)
  workshopBookedCount?: number;

  @Field(() => Int)
  itemsInStock?: number;

  @Field(() => Int)
  sortOrder?: number;

  @Field(() => AttendanceType, { nullable: true })
  attendanceType?: AttendanceType;

  @Field(() => BadgeType, { nullable: true })
  badge?: BadgeType;

  meetingLink?: string;
  location?: string;
  endTime?: boolean;
  customerLocation?: boolean;
  duration?: number;

  startDate: Date;
  endDate: Date;
}
