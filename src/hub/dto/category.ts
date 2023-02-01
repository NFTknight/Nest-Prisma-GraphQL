import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';

export interface GetCategoryArgs {
  pg?: PaginationArgs;
  sortOrder?: SortOrder;
  filter?: CategoryFilterInputForHub;
}

@InputType()
export class CategoryFilterInputForHub {
  @Field(() => [String], { nullable: true })
  vendorId?: [string];

  @Field(() => [String], { nullable: true })
  title?: [string];

  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
