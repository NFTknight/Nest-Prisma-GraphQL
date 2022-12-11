import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerInfo {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phone: string;

  @Field()
  email: string;

  @Field()
  address?: string;

  @Field()
  city?: string;
}
