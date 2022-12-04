import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { VendorInfo } from './vendor-info.model';

@ObjectType()
export class Vendor extends BaseModel {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  active: boolean;

  // @Field(() => VendorInfo, {
  //   nullable: true,
  // })
  // info?: VendorInfo;
}
