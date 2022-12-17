import { ObjectType } from '@nestjs/graphql';
import { BookingTime as BTime } from 'prisma/prisma-client';
@ObjectType()
export class BookingTime implements BTime {
  date: string;
  startTime: string;
  endTime: string;
}
