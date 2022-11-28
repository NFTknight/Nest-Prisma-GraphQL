import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
export class Order extends BaseModel {
  @Field(() => Float)
  totalAmount: number;

  @Field(() => Float)
  finalAmount: number;

  cartId: string;
  @Field(() => Cart, { nullable: false })
  Cart?: Cart;

  vendorId: string;
  @Field(() => Vendor, { nullable: false })
  Vendor?: Vendor;
}
