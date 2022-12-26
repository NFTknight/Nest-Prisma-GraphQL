import { Field, ObjectType, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { Tag } from 'src/tags/models/tag.model';
import { Product } from 'src/products/models/product.model';

@ObjectType()
export class Category extends BaseModel {
  title: string;
  title_ar: string;
  vendorId: string;
  @Field(() => Vendor, { nullable: false })
  vendor?: Vendor;

  @Field(() => [Product], { nullable: false })
  products?: Product[];

  active: boolean;

  @Field(() => Int, { nullable: false })
  sortOrder?: number;
  slug?: string;
}

@ObjectType()
export class Categories {
  @Field(() => [Category], { nullable: false })
  data: Category[];

  @Field(() => Int, { nullable: false })
  count: number;
}
