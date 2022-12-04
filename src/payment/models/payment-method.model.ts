import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
  PaymentMethodId: number;
  PaymentMethodAr: string;
  PaymentMethodEn: string;
  PaymentMethodCode: string;
  IsDirectPayment: boolean;

  @Field(() => Float)
  ServiceCharge: number;

  @Field(() => Float)
  TotalAmount: number;

  CurrencyIso: string;
  ImageUrl: string;
  IsEmbeddedSupported: boolean;
  PaymentCurrencyIso: string;
}
