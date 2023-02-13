import { BaseModel } from 'src/common/models/base.model';
import { User } from 'src/users/models/user.model';
import { VendorBank } from './vendor-bank.model';
import { VendorInfo } from './vendor-info.model';
import { VendorSettings } from './vendor-settings.model';
import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Vendor as PrismaVendor } from '@prisma/client';
import { VendorSubscription } from './vendor-subscription.model';

@ObjectType()
export class MetaDetails {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;
}

@ObjectType()
export class Vendor extends BaseModel implements PrismaVendor {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  name_ar: string;

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

  @Field(() => VendorSubscription, { nullable: true })
  subscription: VendorSubscription;

  @Directive('@hideFields')
  @Field({ nullable: true })
  assignedTo: string;

  @Directive('@hideFields')
  @Field(() => User)
  assign?: User;

  @Directive('@hideFields')
  @Field({ nullable: true })
  notes: string;

  @Field(() => MetaDetails, { nullable: true })
  meta: MetaDetails;

  @Field(() => [String], { nullable: true })
  heading: string[];
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
