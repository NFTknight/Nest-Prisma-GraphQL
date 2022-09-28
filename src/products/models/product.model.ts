import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
export class Product extends BaseModel {
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  @Field(() => Vendor, { nullable: false })
  vendorId: string;
  vendor?: Vendor;
  categoryId: string;
  category?: Category;
  active: boolean;
  minPreorderDays: number;
  price: number;
  price_ar: number;
}
