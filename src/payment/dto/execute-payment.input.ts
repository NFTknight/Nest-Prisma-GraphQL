import { InputType } from '@nestjs/graphql';

@InputType()
export class ExecutePaymentInput {
  amount: number;
  currency: string;
}
