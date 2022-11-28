import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export default function pagination<TItem>(TItemClass: Type<TItem>) {
  @ObjectType()
  class PaginatedType {
    @Field(() => [TItemClass], { nullable: true })
    list: Array<Partial<TItem>>;

    @Field(() => Int)
    totalCount: number;
  }
  return PaginatedType;
}
