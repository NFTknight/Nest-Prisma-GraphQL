import { InputType, Field } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { BookingTimeInput } from './booking-time.input';

@InputType()
export class UpdateBookingInput {
  @Field()
  orderId?: string;

  @Field()
  cartId?: string;

  @Field()
  productId?: string;

  @Field()
  vendorId?: string;

  @Field(() => BookingStatus)
  status?: BookingStatus;

  @Field(() => [BookingTimeInput])
  times?: BookingTimeInput[];
}
