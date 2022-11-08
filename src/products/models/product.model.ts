import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { ProductType } from 'prisma/prisma-client';
import { ProductAttribute } from './product-attribute.model';
import { ProductVariant } from './product-variant.model';
import { ServiceAvailabilities } from './service-availabilities.model';

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'Product Type',
});

@ObjectType()
export class Product extends BaseModel {
  sku: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;

  @Field(() => ProductType)
  type: ProductType;
  previewImage: string;
  image: string;
  vendorId: string;

  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;
  categoryId: string;
  category?: Category;
  active: boolean;
  minPreorderDays: number;

  @Field(() => [ProductVariant], { nullable: false })
  variants?: ProductVariant[];

  @Field(() => [ProductAttribute])
  attributes?: ProductAttribute[];

  @Field(() => [ServiceAvailabilities])
  availabilities?: ServiceAvailabilities[];

  noOfSeats?: number;
  price: number;
  price_ar: number;
}
