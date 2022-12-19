import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { VariantOptions } from './variant-options.model';
import { Vendor } from 'src/vendors/models/vendor.model';
@ObjectType()
export class VariantModel extends BaseModel {
  title?: string;
  title_ar?: string;
  @Field(() => Vendor, { nullable: false })
  vendorId: string;

  @Field(() => [VariantOptions])
  options?: VariantOptions[];
}
