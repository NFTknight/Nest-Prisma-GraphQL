import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { WorkDay } from './workday.model';

@ObjectType()
export class Tag extends BaseModel {
  title: string;
  title_ar: string;
  vendorId: string;

  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;
  active: boolean;
  // TODO add availability

  @Field(() => [WorkDay])
  workdays: WorkDay[];
}
