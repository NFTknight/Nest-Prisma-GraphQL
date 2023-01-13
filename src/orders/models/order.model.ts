import { Field, Float, ObjectType } from '@nestjs/graphql';
import { DeliveryMethods, OrderStatus, PaymentMethods } from '@prisma/client';
import { IsString } from 'class-validator';
import { CartItem } from 'src/cart/models/cart-item.model';
import { Address, Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { WayBill } from 'src/shipping/models/waybill.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { CustomerInfo } from './customer-info.model';
import { Order as PrismaOrder } from '@prisma/client';
import './order.enum';
import { CartAddress } from 'src/cart/models/cart-address.model';

@ObjectType()
export class FormResponse {
  productId: string;
  answers: string;
}

@ObjectType()
export class Order extends BaseModel implements PrismaOrder {
  @IsString()
  orderId: string;

  @Field(() => String, { nullable: true })
  cartId: string;

  @Field(() => Cart, { nullable: true })
  cart: Cart;

  @IsString()
  vendorId: string;
  @Field(() => Vendor, { nullable: true })
  vendor: Vendor;

  @Field(() => OrderStatus, { nullable: false })
  status: OrderStatus;

  @Field(() => DeliveryMethods, { nullable: true })
  deliveryMethod: DeliveryMethods;

  @Field(() => PaymentMethods, { nullable: true })
  paymentMethod: PaymentMethods;

  @Field(() => CustomerInfo, { nullable: true })
  customerInfo: CustomerInfo;

  @Field(() => WayBill, { nullable: true })
  wayBill: WayBill;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field({ nullable: true })
  customerId: string;

  @Field({ nullable: true })
  appliedCoupon: string;

  @Field({ nullable: true })
  invoiceId: string;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Float)
  subTotal: number;

  @Field(() => Float)
  finalPrice: number;

  @Field(() => CartAddress, { nullable: true })
  consigneeAddress: Address;

  @Field(() => CartAddress, { nullable: true })
  shipperAddress: Address;
}
