import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class UserRole {
  userId: string;

  @Field(() => Role)
  role: string;
}
