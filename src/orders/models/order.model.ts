import { Field, ObjectType } from '@nestjs/graphql';
import { DeliveryMethods, OrderStatus, PaymentMethods } from '@prisma/client';
import { IsString } from 'class-validator';
import { Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { CustomerInfo } from './customer-info.model';

@ObjectType()
export class Order extends BaseModel {
  @Field(() => CustomerInfo)
  customerInfo: CustomerInfo;

  @IsString()
  cartId: string;
  @Field(() => Cart, { nullable: false })
  cart?: Cart;

  @IsString()
  vendorId: string;
  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;

  @Field(() => OrderStatus, { nullable: false })
  status: OrderStatus;

  @Field(() => DeliveryMethods)
  deliveryInfo?: DeliveryMethods;

  @Field(() => PaymentMethods)
  paymentInfo?: PaymentMethods;
}
