import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ExecutePaymentError } from './payment-execute.model';

@ObjectType()
class RefundPaymentStatusRes {
  @Field({ nullable: true })
  RefundId: number;
  @Field({ nullable: true })
  RefundStatus: string;
  @Field({ nullable: true })
  InvoiceId: number;
  @Field({ nullable: true })
  Amount: number;
  @Field({ nullable: true })
  RefundReference: string;
  @Field({ nullable: true })
  RefundAmount: number;
}

@ObjectType()
class RefundPaymentAPIResponseSuccess {
  @Field({ nullable: true })
  Key: string;
  @Field(() => Int, { nullable: true })
  RefundId: number;
  @Field({ nullable: true })
  RefundReference: string;
  @Field({ nullable: true })
  Amount: string;
  @Field({ nullable: true })
  Comment: string;
  @Field(() => [RefundPaymentStatusRes], { nullable: true })
  RefundStatusResult: [RefundPaymentStatusRes];
}

@ObjectType()
export class RefundPaymentAPIResponse {
  @Field(() => RefundPaymentAPIResponseSuccess, { nullable: true })
  responseData: RefundPaymentAPIResponseSuccess;
  @Field(() => [ExecutePaymentError], { nullable: true })
  errors: ExecutePaymentError[];
}
