import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { VendorBank } from './vendor-bank.model';
import { VendorInfo } from './vendor-info.model';
import { VendorSettings } from './vendor-settings.model';

@ObjectType()
export class Vendor extends BaseModel {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  active: boolean;

  @Field(() => VendorInfo, {
    nullable: true,
  })
  info?: VendorInfo;

  @Field(() => VendorSettings)
  settings: VendorSettings;

  @Field(() => VendorBank)
  bank: VendorBank;

  @Field()
  logo?: string;

  @Field()
  heroImage?: string;
}
