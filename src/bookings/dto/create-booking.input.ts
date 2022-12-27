import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { BookingSlotInput } from './booking-time.input';
import { CustomerInput } from 'src/cart/dto/cart.input';

@InputType()
export class CreateBookingInput {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field(() => CustomerInput)
  customerInfo: CustomerInput;

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
