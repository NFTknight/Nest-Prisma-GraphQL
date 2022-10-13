import { Field, ObjectType } from '@nestjs/graphql';

import { ServiceAvailabilities as SAvailabilities } from 'prisma/prisma-client';

@ObjectType()
export class ServiceAvailabilities implements SAvailabilities {
  @Field()
  startTime: Date;

  @Field()
  endTime: Date;
}
