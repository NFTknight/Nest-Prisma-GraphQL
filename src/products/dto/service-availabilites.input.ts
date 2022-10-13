import { InputType } from '@nestjs/graphql';

import { ServiceAvailabilities } from 'prisma/prisma-client';

@InputType()
export class ServiceAvailabilitiesInput implements ServiceAvailabilities {
  startTime: Date;
  endTime: Date;
}
