import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { OtpResponse } from './otp.model';

enum OtpStatus {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

export enum OtpStatusCode {
  CORRECT = 101,
  INCORRECT = 107,
  ATTEMPTS_EXCEEDED = 108,
  CODE_EXPIRED = 109,
  ALREADY_VERIFIED = 110,
}

registerEnumType(OtpStatus, {
  name: 'OtpStatus',
  description: 'OTP status',
});

registerEnumType(OtpStatusCode, {
  name: 'OtpStatusCode',
  description: 'OTP status code',
});

@ObjectType()
export class CheckOtpResponse extends OtpResponse {
  id: string;
  to: string;
  status: OtpStatusCode;
}
