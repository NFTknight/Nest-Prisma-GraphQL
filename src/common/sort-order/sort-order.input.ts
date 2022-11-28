import { Field, InputType } from '@nestjs/graphql';
import { OrderDirection } from './sort-order-direction';

@InputType()
export class SortOrder {
  @Field()
  field: string;

  @Field(() => OrderDirection)
  direction: OrderDirection;
}
