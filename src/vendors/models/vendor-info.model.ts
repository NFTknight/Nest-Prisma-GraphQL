import { Field, ObjectType } from '@nestjs/graphql';
import { Certificate } from '@prisma/client';

@ObjectType()
class Certificates {
  title: string;
  image: string;
}

@ObjectType()
export class VendorInfo {
  @Field()
  address?: string;

  @Field()
  phone?: string;

  @Field()
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
  location?: string;

  @Field()
  instagram?: string;

  @Field()
  facebook?: string;

  @Field()
  snapchat?: string;

  @Field()
  whatsapp?: string;

  @Field()
  vat_num?: string;

  @Field()
  cr_num?: string;

  @Field(() => [Certificates])
  certificates?: Certificate[];

  @Field()
  iban?: string;
}
