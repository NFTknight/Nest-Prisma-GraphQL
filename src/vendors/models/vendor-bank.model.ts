import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VendorBank {
  @Field()
  bankName: string;

  @Field()
  iban: string;

  @Field()
  accountNumber: string;

  @Field()
  beneficiary: string;
}
