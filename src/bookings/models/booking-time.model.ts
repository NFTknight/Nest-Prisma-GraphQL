import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BookingTime {
  date: string;
  startTime: string;
  endTime: string;
}
