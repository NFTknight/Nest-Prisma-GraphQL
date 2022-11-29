import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Vendor extends BaseModel {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  storeStatus: boolean;

  @Field()
  active: boolean;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  bankName: string;

  @Field()
  iban: string;
  @Field()
  accountNumber: string;

  @Field()
  beneficiary: string;

  @Field()
  addressUrl: string;

  @Field()
  slug: string;

  @Field()
  isCheck: boolean;

  @Field()
  shortName: boolean;

  @Field()
  description_ar: string;

  @Field()
  terms: string;

  @Field()
  isOpen: boolean;

  @Field()
  demo: boolean;
}
