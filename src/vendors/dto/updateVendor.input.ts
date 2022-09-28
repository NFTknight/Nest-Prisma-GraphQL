import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateVendorInput {
  @Field()
  email?: string;

  @Field()
  name?: string;

  @Field()
  description?: string;

  @Field()
  storeStatus?: boolean;

  @Field()
  active?: boolean;

  @Field()
  slug?: string;

  @Field()
  address?: string;

  @Field()
  phone?: string;

  @Field()
  bankName?: string;

  @Field()
  iban?: string;
  @Field()
  accountNumber?: string;

  @Field()
  beneficiary?: string;

  @Field()
  addressUrl?: string;

  @Field()
  url?: string;

  @Field()
  isCheck?: boolean;

  @Field()
  shortName?: boolean;

  @Field()
  description_ar?: string;

  @Field()
  terms?: string;

  @Field()
  isOpen?: boolean;

  @Field()
  demo?: boolean;
}
