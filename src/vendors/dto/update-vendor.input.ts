import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

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
}

@InputType()
export class UpdateVendorInput {
  @Field()
  name?: string;

  @Field()
  active?: boolean;

  // @Field(() => UpdateVendorInfoInput, {
  //   nullable: true,
  // })
  // info?: UpdateVendorInfoInput;
}
