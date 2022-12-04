import { InputType } from '@nestjs/graphql';

@InputType()
export class InitiatePaymentInput {
  amount: number;
  currency: string;
}
