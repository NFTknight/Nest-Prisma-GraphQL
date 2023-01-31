import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

export interface GetOrderArgs {
  pg?: PaginationArgs;
  sortOrder?: SortOrder;
  filter?: OrderFilterInputForHub;
}

@InputType()
export class OrderFilterInputForHub {
  @Field(() => [String], { nullable: true })
  orderId?: [string];

  @Field(() => [String], { nullable: true })
  email?: [string];

  @Field(() => [String], { nullable: true })
  vendorId?: string;

  @Field(() => [String], { nullable: true })
  productId?: string;

  @Field(() => [OrderStatus], { nullable: true })
  status?: OrderStatus;
}
