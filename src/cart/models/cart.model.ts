import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { CartItem } from './cart-item.model';
import { Cart as PrismaCart } from '@prisma/client';
import { CustomerInfo } from 'src/orders/models/customer-info.model';
import {
  DeliveryMethods,
  PaymentMethods,
  CustomerInfo as CustomerInfoModel,
} from '@prisma/client';
import { CartAddress } from './cart-address.model';

type Address = {
  ContactName: string;
  ContactPhoneNumber: string;
  Country: string;
  City: string;
  AddressLine1: string;
  addressUrl: string;
};
@ObjectType()
export class Cart extends BaseModel implements PrismaCart {
  @Field(() => [CartItem])
  items: CartItem[];

  @Field()
  customerId: string;

  @Field({ nullable: true })
  appliedCoupon: string;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Float)
  finalPrice: number;

  @Field()
  vendorId: string;

  @Field(() => CustomerInfo, { nullable: true })
  customerInfo: CustomerInfoModel;

  @Field(() => PaymentMethods, { nullable: true })
  paymentMethod: PaymentMethods;

  @Field(() => DeliveryMethods, { nullable: true })
  deliveryMethod: DeliveryMethods;

  @Field(() => CartAddress, { nullable: true })
  ConsigneeAddress: Address;

  @Field(() => CartAddress, { nullable: true })
  ShipperAddress: Address;
}
