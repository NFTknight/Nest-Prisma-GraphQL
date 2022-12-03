import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';

@InputType()
export class SendOtpInput {
  @Field()
  @IsPhoneNumber('SA')
  phone: string;
}
