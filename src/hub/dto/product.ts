import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { Field, InputType } from '@nestjs/graphql';
import { AttendanceType, ProductType } from '@prisma/client';

export interface GetProductArgs {
  pg?: PaginationArgs;
  sortOrder?: SortOrder;
  filter?: ProductFilterInputForHub;
}

@InputType()
export class ProductFilterInputForHub {
  @Field(() => [ProductType], { nullable: true })
  type?: [ProductType];

  @Field(() => [AttendanceType], { nullable: true })
  attendanceType?: [AttendanceType];

  @Field({ nullable: true })
  active?: boolean;

  @Field(() => [String], { nullable: true })
  vendorId?: [string];

  @Field(() => [String], { nullable: true })
  categoryId?: [string];
}
