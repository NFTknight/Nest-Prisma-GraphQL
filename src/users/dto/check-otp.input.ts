import { Field, InputType } from '@nestjs/graphql';
import { IsNumberString, IsPhoneNumber, Length } from 'class-validator';

@InputType()
export class CheckOtpInput {
  @Field()
  @IsPhoneNumber('SA')
  phone: string;

  @Field()
  @IsNumberString()
  @Length(4)
  code: string;
}
