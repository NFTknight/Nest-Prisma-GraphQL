import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BookingTime } from 'src/bookings/models/booking-time.model';
import { BaseModel } from 'src/common/models/base.model';
import { Product } from 'src/products/models/product.model';

@ObjectType()
export class CartItem extends BaseModel {
  productId: string;
  Product?: Product;
  productVariant?: string;

  @Field(() => Int)
  quantity: number;

  cartId: string;

  tagId?: string;

  @Field(() => [BookingTime])
  slots?: BookingTime[];
}
