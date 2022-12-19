import { Field, InputType } from '@nestjs/graphql';
import { BookingTime } from '@prisma/client';

@InputType()
export class BookingSlotInput implements BookingTime {
  @Field()
  from: Date;
  @Field()
  to: Date;
}
