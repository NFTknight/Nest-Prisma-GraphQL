import { Field, ObjectType } from '@nestjs/graphql';
import { DeliveryMethods, OrderStatus, PaymentMethods } from '@prisma/client';
import { IsString } from 'class-validator';
import { Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { WayBill } from 'src/shipping/models/waybill.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { CustomerInfo } from './customer-info.model';

@ObjectType()
export class Order extends BaseModel {
  @Field(() => CustomerInfo, { nullable: true })
  customerInfo: CustomerInfo;

  @IsString()
  orderId: string;

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
  deliveryMethod?: DeliveryMethods;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => WayBill, { nullable: true })
  wayBill?: WayBill;
}
