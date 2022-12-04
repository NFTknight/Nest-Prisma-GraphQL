import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentSession {
  SessionId: string;
  CountryCode: string;
}
