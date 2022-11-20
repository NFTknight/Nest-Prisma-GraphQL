import { Field, ObjectType } from '@nestjs/graphql';

import { ServiceAvailability as SAvailabilities } from 'prisma/prisma-client';

@ObjectType()
export class ServiceAvailability implements SAvailabilities {
  @Field(() => [String], { nullable: true })
  days: string[];

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}
