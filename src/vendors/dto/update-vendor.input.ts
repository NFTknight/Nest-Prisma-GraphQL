import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods } from '@prisma/client';
import { IsEmail } from 'class-validator';

registerEnumType(DeliveryMethods, {
  name: 'DeliveryMethods',
  description: 'Delivery Methods',
});

registerEnumType(PaymentMethods, {
  name: 'PaymentMethods',
  description: 'Payment Methods',
});

@InputType()
class UpdateVendorInfoInput {
  @Field()
  address?: string;

  @Field()
  phone?: string;

  @Field()
  @IsEmail()
  email?: string;

  @Field()
  addressUrl?: string;

  @Field()
  description?: string;

  @Field()
  description_ar?: string;

  @Field()
  terms?: string;

  @Field()
  heroImage?: string;

  @Field()
  logo?: string;
}

@InputType()
class UpdateVendorBankInput {
  @Field()
  bankName: string;

  @Field()
  iban: string;

  @Field()
  accountNumber: string;

  @Field()
  beneficiary: string;
}

@InputType()
class UpdateVendorSettingsInput {
  @Field(() => [PaymentMethods])
  paymentMethods: PaymentMethods[];

  @Field(() => [DeliveryMethods])
  deliveryMethods: DeliveryMethods[];
}

@InputType()
export class UpdateVendorInput {
  @Field()
  name?: string;

  @Field()
  active?: boolean;

  @Field()
  info?: UpdateVendorInfoInput;

  @Field()
  bank?: UpdateVendorBankInput;

  @Field()
  settings?: UpdateVendorSettingsInput;
}
