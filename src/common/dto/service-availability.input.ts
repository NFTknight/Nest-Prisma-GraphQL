import { InputType } from '@nestjs/graphql';

import { ServiceAvailability } from 'prisma/prisma-client';

@InputType()
export class ServiceAvailabilityInput implements ServiceAvailability {
  days: string[];
  startTime: string;
  endTime: string;
}
