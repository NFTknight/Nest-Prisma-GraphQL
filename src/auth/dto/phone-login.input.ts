import { IsPhoneNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PhoneLoginInput {
  @Field()
  @IsPhoneNumber('SA')
  phone: string;
}
