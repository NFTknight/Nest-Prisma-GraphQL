import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Product } from 'src/products/models/product.model';

@ObjectType()
class TimeSlot {
  startTime: Date;
  endTime: Date;
}

@ObjectType()
export class CartItem extends BaseModel {
  productId: string;
  Product?: Product;
  productVariant?: string;

  @Field(() => Int)
  quantity: number;

  cartId: string;

  tagId?: string;

  @Field(() => [TimeSlot])
  slots?: TimeSlot[];
}
