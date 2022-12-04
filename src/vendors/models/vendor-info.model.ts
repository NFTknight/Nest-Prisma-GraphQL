import { Field, ObjectType } from '@nestjs/graphql';

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
}
