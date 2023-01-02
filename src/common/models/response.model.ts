import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultResponse {
  success: boolean;
  message: string;
}
