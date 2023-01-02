import { BaseModel } from 'src/common/models/base.model';
import { User } from 'src/users/models/user.model';
import { VendorBank } from './vendor-bank.model';
import { VendorInfo } from './vendor-info.model';
import { VendorSettings } from './vendor-settings.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Vendor as PrismaVendor } from '@prisma/client';

@ObjectType()
export class Vendor extends BaseModel implements PrismaVendor {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => Int, { nullable: true })
  MF_vendorCode: number;

  @Field()
  active: boolean;

  @Field(() => VendorInfo, {
    nullable: true,
  })
  info: VendorInfo;

  @Field(() => VendorSettings, {
    nullable: true,
  })
  settings: VendorSettings;

  @Field(() => VendorBank, {
    nullable: true,
  })
  bank: VendorBank;

  @Field()
  ownerId: string;

  @Field(() => User)
  owner?: User;
}

@ObjectType()
export class VendorsView {
  @Field(() => [VendorView], { nullable: true })
  list: VendorView[];

  @Field(() => Int)
  totalCount: number;
}

@ObjectType()
export class VendorView {
  @Field(() => Int)
  numberProducts: number;

  @Field(() => Int)
  numberOrders?: number;

  @Field(() => Int)
  numberServices?: number;

  @Field(() => Int)
  numberBookings?: number;

  @Field(() => Int)
  numberCategories?: number;

  @Field(() => Int)
  numberCoupons?: number;

  @Field(() => String)
  accountManager?: string;

  @Field(() => String)
  vendorName?: string;

  @Field(() => String)
  vendorUrl?: string;
}
