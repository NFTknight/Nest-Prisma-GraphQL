import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
export class Form extends BaseModel {
  content: string;

  vendorId: string;
  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;
}
