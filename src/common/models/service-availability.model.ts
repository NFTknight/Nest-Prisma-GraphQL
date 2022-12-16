import { Field, ObjectType } from '@nestjs/graphql';

import { ServiceAvailability as SAvailabilities } from 'prisma/prisma-client';

@ObjectType()
export class ServiceAvailability implements SAvailabilities {
  @Field()
  date: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field()
  isAvailable: boolean;
}
