import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExecutePayment {
  @Field({ nullable: true })
  InvoiceId: number;
  @Field({ nullable: true })
  IsDirectPayment: boolean;
  @Field({ nullable: true })
  PaymentURL: string;
  @Field({ nullable: true })
  CustomerReference: string;
  @Field({ nullable: true })
  RecurringId: string;
}

@ObjectType()
export class ExecutePaymentError {
  Name: string;
  Error: string;
}
