import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartAddress {
  @Field()
  contactName: string;

  @Field()
  contactPhoneNumber: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  addressLine1: string;

  @Field(() => String, { nullable: true })
  addressUrl: string;
}
