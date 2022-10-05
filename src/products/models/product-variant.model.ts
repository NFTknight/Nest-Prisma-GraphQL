import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { ProductType, ProductAttribute } from 'prisma/prisma-client';

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'Product Type',
});

@ObjectType()
export class ProductVariant extends BaseModel {
  sku: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  previewImage: string;
  image: string;
  active: boolean;
  price: number;
  price_ar: number;
  productId: string;
}
