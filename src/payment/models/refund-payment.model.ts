import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ExecutePaymentError } from './payment-execute.model';

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
}

@ObjectType()
export class RefundPaymentAPIResponse {
  @Field(() => RefundPaymentAPIResponseSuccess, { nullable: true })
  responseData: RefundPaymentAPIResponseSuccess;
  @Field(() => [ExecutePaymentError], { nullable: true })
  errors: ExecutePaymentError[];
}
