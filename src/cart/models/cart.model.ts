import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { CartItem } from './cart-item.model';

@ObjectType()
export class Cart extends BaseModel {
  @Field(() => [CartItem])
  items?: CartItem[];

  vendorId: string;
  vendor?: Vendor;

  appliedCoupon: string;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Float)
  finalPrice: number;

  checkedOut: boolean;
}
