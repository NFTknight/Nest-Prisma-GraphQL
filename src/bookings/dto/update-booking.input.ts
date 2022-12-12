import { InputType, Field } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';

@InputType()
export class UpdateBookingInput {
  @Field()
  orderId?: string;

  @Field()
  cartId?: string;

  @Field()
  productId?: string;

  @Field(() => BookingStatus)
  status?: BookingStatus;

  startDate?: Date;
  endDate?: Date;
}
