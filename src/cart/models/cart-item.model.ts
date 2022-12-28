import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BookingTime } from 'src/bookings/models/booking-time.model';
import {
  AttendanceType,
  CartItem as PrismaCartItem,
  ProductType,
} from '@prisma/client';
import { BadgeType } from 'src/products/models/product.model';
import { Form } from 'src/forms/models/forms.model';
import { Tag } from 'src/tags/models/tag.model';
import { Variant } from 'src/products/models/variant.model';
import { Category } from 'src/categories/models/category.model';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
export class CartItem implements PrismaCartItem {
  slug?: string;

  title?: string;
  title_ar?: string;

  description?: string;
  description_ar?: string;

  @Field(() => ProductType)
  type?: ProductType;

  image?: string;

  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;

  categoryId?: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  active?: boolean;

  @Field(() => Int, { nullable: true })
  minPreorderDays?: number;

  @Field(() => [Variant], { nullable: true })
  variants?: Variant[];

  tagIds?: string[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => Int, { nullable: true })
  noOfSeats?: number;

  @Field(() => Int, { nullable: true })
  bookedSeats?: number;

  @Field(() => Int, { nullable: true })
  itemsInStock?: number;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;

  @Field(() => AttendanceType, { nullable: true })
  attendanceType?: AttendanceType;

  formId?: string;
  @Field(() => Form, { nullable: true })
  form?: Form;

  @Field(() => BadgeType, { nullable: true })
  badge?: BadgeType;

  @Field({ nullable: true })
  meetingLink?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  endTime?: boolean;

  @Field({ nullable: true })
  customerLocation?: boolean;

  @Field({ nullable: true })
  duration?: number;

  startDate?: Date;
  endDate?: Date;

  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field(() => Float)
  @IsNotEmpty()
  price: number;

  @Field({ nullable: true })
  answers: string;

  @Field(() => Int)
  quantity: number;

  @Field({ nullable: true })
  tagId: string;

  @Field(() => [BookingTime], { nullable: true })
  slots: BookingTime[];
}
