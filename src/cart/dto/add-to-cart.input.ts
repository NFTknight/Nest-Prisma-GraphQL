import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { BookingTimeInput } from 'src/bookings/dto/booking-time.input';

@InputType()
export class AddToCartInput {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field({ nullable: true })
  productVariant?: string;

  @Field({ nullable: true })
  cartId?: string;

  @Field(() => Int)
  quantity?: number;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  tagId?: string;

  @Field(() => [BookingTimeInput])
  slots?: BookingTimeInput[];
}
