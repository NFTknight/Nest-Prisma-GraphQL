import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty, MinLength } from 'class-validator';
import { GraphQLJWT } from 'graphql-scalars';

@InputType()
export class ResetPwtInput {
  @IsNotEmpty()
  @IsJWT()
  @Field(() => GraphQLJWT)
  token: string;

  @IsNotEmpty()
  @Field()
  @MinLength(8)
  password: string;
}
