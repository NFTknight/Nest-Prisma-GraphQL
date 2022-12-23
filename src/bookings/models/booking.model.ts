import { Field, ObjectType } from '@nestjs/graphql';
import { BookingStatus } from 'prisma/prisma-client';
import { Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { Order } from 'src/orders/models/order.model';
import { Product } from 'src/products/models/product.model';
import { Tag } from 'src/tags/models/tag.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { BookingTime } from './booking-time.model';
import './booking-status.enum';

@ObjectType()
export class Booking extends BaseModel {
  orderId?: string;

  @Field(() => Order)
  order?: Order;

  cartId: string;
  @Field(() => Cart)
  cart?: Cart;

  tagId: string;
  @Field(() => Tag)
  tag?: Tag;

  @Field()
  vendorId: string;

  productId: string;
  @Field(() => Product)
  product?: Product;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field(() => [BookingTime], { nullable: true })
  slots?: BookingTime[];

  @Field(() => Date, { nullable: true })
  holdTimestamp?: Date;
}
