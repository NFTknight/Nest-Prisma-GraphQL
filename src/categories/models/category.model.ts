import { Field, ObjectType, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { Tag } from 'src/tags/models/tag.model';

@ObjectType()
export class Category extends BaseModel {
  title: string;
  title_ar: string;
  vendorId: string;
  @Field(() => Vendor, { nullable: false })
  Vendor?: Vendor;
  active: boolean;
  @Field(() => [String], { nullable: false })
  tagIds: string[];
  @Field(() => [Tag], { nullable: false })
  Tags?: Tag[];

  @Field(() => Int, { nullable: false })
  sortOrder: number;
}
