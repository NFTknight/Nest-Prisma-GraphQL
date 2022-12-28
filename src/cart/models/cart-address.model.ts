import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartAddress {
  @Field()
  ContactName: string;

  @Field()
  ContactPhoneNumber: string;

  @Field()
  Country: string;

  @Field()
  City: string;

  @Field()
  AddressLine1: string;

  @Field(() => String, { nullable: true })
  addressUrl: string;
}
