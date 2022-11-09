import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { ProductType } from 'prisma/prisma-client';
import { ProductAttribute } from './product-attribute.model';
import { ProductVariant } from './product-variant.model';
import { ServiceAvailability } from 'src/common/models/service-availability.model';
import { Tag } from 'src/tags/models/tag.model';

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'Product Type',
});

@ObjectType()
export class Product extends BaseModel {
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

  categoryId: string;
  category?: Category;

  active: boolean;
  minPreorderDays: number;

  @Field(() => [ProductVariant], { nullable: false })
  variants?: ProductVariant[];

  @Field(() => [ProductAttribute])
  attributes?: ProductAttribute[];

  @Field(() => [ServiceAvailability], { nullable: true })
  availabilities?: ServiceAvailability[];

  tagIds: string[];
  @Field(() => [Tag], { nullable: false })
  Tags?: Tag[];

  noOfSeats?: number;
  itemsInStock?: number;
  price: number;
}
