import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  email: string;
  firstName?: string;
  lastName?: string;
  verified: boolean;
  phone?: string;

  @Field(() => Role)
  role: Role;

  @HideField()
  password: string;
}
