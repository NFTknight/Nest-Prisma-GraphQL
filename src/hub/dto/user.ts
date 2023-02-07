import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';

export interface GetUsersArgs {
  pg?: PaginationArgs;
  sortOrder?: SortOrder;
  filter?: UserFilterInputForHub;
}

@InputType()
export class UserFilterInputForHub {
  @Field(() => [String], { nullable: true })
  userId?: [string];

  @Field(() => [String], { nullable: true })
  email?: [string];

  @Field(() => Boolean, { nullable: true })
  verified?: boolean;

  @Field(() => [Role], { nullable: true })
  role?: [Role];
}
