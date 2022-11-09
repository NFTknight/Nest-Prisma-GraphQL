import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { ServiceAvailability } from 'src/common/models/service-availability.model';

@ObjectType()
export class Tag extends BaseModel {
  title: string;
  title_ar: string;
  @Field(() => Vendor, { nullable: false })
  vendorId: string;
  vendor?: Vendor;
  active: boolean;
  @Field(() => [ServiceAvailability])
  availabilities: ServiceAvailability[];
}
