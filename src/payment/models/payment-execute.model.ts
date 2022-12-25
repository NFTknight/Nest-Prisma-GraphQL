import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExecutePayment {
  InvoiceId: number;
  IsDirectPayment: boolean;
  PaymentURL: string;
  CustomerReference: string;
  RecurringId: string;
}

@ObjectType()
export class ExecutePaymentError {
  Name: string;
  Error: string;
}
