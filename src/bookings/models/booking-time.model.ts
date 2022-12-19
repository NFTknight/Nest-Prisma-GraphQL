import { ObjectType } from '@nestjs/graphql';
import { BookingTime as BTime } from 'prisma/prisma-client';

@ObjectType()
export class BookingTime implements BTime {
  from: Date;
  to: Date;
}
