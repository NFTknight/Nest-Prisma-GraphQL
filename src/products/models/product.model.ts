import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { ProductType, AttendanceType } from 'prisma/prisma-client';
import { VariantModel } from '../../variants/models/variant.model';
import { ServiceAvailability } from 'src/common/models/service-availability.model';
import { Tag } from 'src/tags/models/tag.model';
import './product-type.enum';

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

  minPreorderDays?: number;

  @Field(() => [VariantModel], { nullable: true })
  variants?: any[];

  tagIds: string[];

  @Field(() => [Tag], { nullable: true })
  Tags?: Tag[];
  @Field(() => Int)
  noOfSeats?: number;

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
  duration?: number;

  startDate: Date;
  endDate: Date;
}
