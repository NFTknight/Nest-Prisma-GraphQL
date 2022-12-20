import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { BookingSlotInput } from 'src/bookings/dto/booking-time.input';

@InputType()
export class AddToCartInput {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field({ nullable: true })
  cartId?: string;

  @Field(() => Int)
  quantity?: number;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  tagId?: string;

  @Field(() => [BookingSlotInput])
  slots?: BookingSlotInput[];
}
