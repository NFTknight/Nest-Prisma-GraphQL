import { ObjectType } from '@nestjs/graphql';
import { BookingTime as PrismaBookingTime } from 'prisma/prisma-client';

@ObjectType()
export class BookingTime implements PrismaBookingTime {
  from: Date;
  to: Date;
}
