import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPaymentStatusResponse {
  orderStatus: string;
  paymentStatus: string;
}
