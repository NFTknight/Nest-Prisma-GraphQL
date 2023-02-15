import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { MetaDetails, Vendor } from 'src/vendors/models/vendor.model';
import { Product as PrismaProduct } from '@prisma/client';
import {
  ProductType,
  AttendanceType,
  BadgeType as Btype,
  Location as LocType,
} from 'prisma/prisma-client';
import { Tag } from 'src/tags/models/tag.model';
import './product-type.enum';
import { Variant } from './variant.model';
import { Form } from 'src/forms/models/forms.model';

@ObjectType()
export class BadgeType implements Btype {
  @Field(() => AttendanceType)
  label: AttendanceType;
}
@ObjectType()
export class Location implements LocType {
  url: string;
  address: string;
  @Field(() => Float)
  lat: number;
  @Field(() => Float)
  lng: number;
}
@ObjectType()
export class Product extends BaseModel implements PrismaProduct {
  slug: string;
  title: string;
  title_ar: string;

  description: string;
  description_ar: string;

  @Field(() => ProductType)
  type: ProductType;

  image: string;

  @Field(() => [String], { nullable: true })
  images: string[];

  vendorId: string;

  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;

  @Field(() => String, { nullable: true })
  categoryId: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  active: boolean;

  @Field(() => Int, { nullable: true })
  minPreorderDays: number;

  @Field(() => [Variant], { nullable: true })
  variants: Variant[];

  tagIds: string[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => Int, { nullable: true })
  noOfSeats: number;

  @Field(() => Int, { nullable: true })
  bookedSeats: number;

  @Field(() => Int, { nullable: true })
  sortOrder: number;

  @Field(() => AttendanceType, { nullable: true })
  attendanceType: AttendanceType;

  @Field(() => String, { nullable: true })
  formId: string;
  @Field(() => Form, { nullable: true })
  form?: Form;

  @Field(() => BadgeType, { nullable: true })
  badge: BadgeType;

  @Field({ nullable: true })
  qrOTP: number;

  @Field({ nullable: true })
  meetingLink: string;

  @Field({ nullable: true })
  location: Location;

  @Field({ nullable: true })
  endTime: boolean;

  @Field({ nullable: true })
  customerLocation: boolean;

  @Field({ nullable: true })
  duration: number;

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field(() => MetaDetails, { nullable: true })
  meta: MetaDetails;
}
