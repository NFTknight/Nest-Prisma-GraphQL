import { Field, ObjectType } from '@nestjs/graphql';
import {
  ExecutePayment,
  ExecutePaymentError,
} from 'src/payment/models/payment-execute.model';
import { Order } from './order.model';

@ObjectType()
export class OrderPayment extends Order {
  @Field(() => ExecutePayment, { nullable: true })
  payment: ExecutePayment;

  @Field(() => [ExecutePaymentError], { nullable: true })
  errors: ExecutePaymentError[];
}
