import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';

@InputType()
export class CreateBookingInput {
  @Field()
  @IsNotEmpty()
  orderId: string;

  @Field()
  @IsNotEmpty()
  cartId: string;

  @Field()
  @IsNotEmpty()
  productId: string;

  @Field(() => BookingStatus)
  status: BookingStatus;

  startDate?: Date;
  endDate?: Date;
}
