import { InputType } from '@nestjs/graphql';

@InputType()
export class ServiceAvailabilityInput {
  date: string;
  startTime: string;
  endTime: string;
}
