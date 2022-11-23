import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Variant } from 'src/products/models/variant.model';
import { Product } from 'src/products/models/product.model';

@ObjectType()
export class CartItem extends BaseModel {
  productId: string;
  product?: Product;
  productVariantId?: string;
  variant?: Variant;
  appointmentTime?: Date;
  quantity: number;
  cartId: string;
}
