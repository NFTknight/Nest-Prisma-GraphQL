import { Field, InputType } from '@nestjs/graphql';
import { BookingTime } from '@prisma/client';

@InputType()
export class BookingTimeInput implements BookingTime {
  @Field()
  date: string;
  @Field()
  startTime: string;
  @Field()
  endTime: string;
}
