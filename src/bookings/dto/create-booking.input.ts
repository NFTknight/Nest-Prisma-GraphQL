import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { BookingSlotInput } from './booking-time.input';

@InputType()
export class CreateBookingInput {
  @Field()
  @IsNotEmpty()
  cartId: string;

  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  @IsNotEmpty()
  tagId: string;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field(() => [BookingSlotInput])
  @IsNotEmpty()
  slots: BookingSlotInput[];
}
