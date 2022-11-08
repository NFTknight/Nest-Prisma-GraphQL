import { Field, ObjectType, Float } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
export class Coupon extends BaseModel {
  code: string;

  @Field(() => Float, { nullable: false })
  discount: number;
  vendorId: string;

  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;
  active: boolean;
}
