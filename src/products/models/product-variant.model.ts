import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { ProductAttribute } from './product-attribute.model';

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
  productId: string;

  @Field(() => [ProductAttribute])
  attributes: ProductAttribute[];
}
