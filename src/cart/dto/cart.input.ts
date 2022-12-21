import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { BookingTime } from 'src/bookings/models/booking-time.model';

@InputType()
export class BookingTimeInput implements BookingTime {
  @Field()
  @IsNotEmpty()
  from: Date;

  @Field()
  @IsNotEmpty()
  to: Date;
}

@InputType()
export class CartItemInput {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field({ nullable: true })
  answers: string;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
  })
  quantity: number;

  @Field({ nullable: true })
  tagId: string;

  @Field(() => [BookingTimeInput], { nullable: true })
  slots: BookingTimeInput[];
}
