import { ObjectType } from '@nestjs/graphql';
import { BookingTime as IBookingTime } from 'prisma/prisma-client';

@ObjectType()
export class BookingTime implements IBookingTime {
  from: Date;
  to: Date;
}
