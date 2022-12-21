import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BookingTime } from 'src/bookings/models/booking-time.model';
import { CartItem as ICartItem } from '@prisma/client';

@ObjectType()
export class CartItem implements ICartItem {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field(() => Float)
  @IsNotEmpty()
  price: number;

  @Field({ nullable: true })
  answers: string;

  @Field(() => Int)
  quantity: number;

  @Field({ nullable: true })
  tagId: string;

  @Field(() => [BookingTime], { nullable: true })
  slots: BookingTime[];
}
