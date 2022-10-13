import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { ProductVariant } from 'src/products/models/product-variant.model';
import { Product } from 'src/products/models/product.model';

@ObjectType()
export class CartItem extends BaseModel {
  productId: string;
  product?: Product;
  productVariantId?: string;
  variant?: ProductVariant;
  appointmentTime?: Date;
  quantity: number;
  cartId: string;
}
