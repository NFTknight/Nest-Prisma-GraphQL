import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Variant } from 'src/products/models/variant.model';
import { Product } from 'src/products/models/product.model';

@ObjectType()
export class CartItem extends BaseModel {
  productId: string;
  Product?: Product;
  productVariant?: string;

  @Field(() => Variant, { nullable: true })
  Variant?: Variant;

  @Field(() => Int)
  quantity: number;

  cartId: string;
}
