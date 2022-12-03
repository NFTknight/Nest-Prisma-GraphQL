import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OtpResponse {
  id: string;
  to: string;
}
