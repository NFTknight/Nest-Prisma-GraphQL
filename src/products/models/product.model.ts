import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { ProductType } from 'prisma/prisma-client';

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
  type: ProductType;
  image: string;
  @Field(() => Vendor, { nullable: false })
  vendorId: string;
  vendor?: Vendor;
  active: boolean;
  minPreorderDays: number;
  price: number;
  price_ar: number;
}
