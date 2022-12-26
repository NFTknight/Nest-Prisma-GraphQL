import { Field, ObjectType } from '@nestjs/graphql';
import { CustomerInfo as PrismaCustomerInfo } from '@prisma/client';

@ObjectType()
export class CustomerInfo implements PrismaCustomerInfo {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phone: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  city: string;
}
