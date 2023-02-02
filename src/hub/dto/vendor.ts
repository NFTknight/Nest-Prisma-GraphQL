import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';
import { UpdateVendorInput } from 'src/vendors/dto/update-vendor.input';

export interface GetVendorsArgs {
  pg?: PaginationArgs;
  sortOrder?: SortOrder;
  filter?: VendorFilterInputForHub;
}

@InputType()
export class VendorFilterInputForHub {
  @Field(() => [String], { nullable: true })
  vendorId?: [string];

  @Field(() => [String], { nullable: true })
  name?: [string];

  @Field(() => [String], { nullable: true })
  name_ar?: [string];

  @Field(() => [String], { nullable: true })
  slug?: [string];

  @Field(() => [String], { nullable: true })
  email?: [string];

  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}

@InputType()
export class UpdateVendorInputForHub extends UpdateVendorInput {
  @Field({ nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  assignedTo?: string;

  @Field({ nullable: true })
  notes?: string;
}
