import { Field, ObjectType } from '@nestjs/graphql';
import { BookingStatus } from 'prisma/prisma-client';
import { Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { Order } from 'src/orders/models/order.model';
import { Product } from 'src/products/models/product.model';
import './booking-status.enum';

@ObjectType()
export class Booking extends BaseModel {
  orderId: string;

  @Field(() => Order)
  Order?: Order;

  cartId: string;
  @Field(() => Cart)
  Cart?: Cart;

  productId: string;
  @Field(() => Product)
  Product?: Product;

  @Field(() => BookingStatus)
  status: BookingStatus;

  startDate: Date;
  endDate: Date;

  @Field(() => Date, { nullable: true })
  holdTimestamp?: Date;
}
