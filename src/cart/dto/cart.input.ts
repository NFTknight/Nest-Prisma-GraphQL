import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { BookingTime } from 'src/bookings/models/booking-time.model';
import { DeliveryMethods, PaymentMethods } from '@prisma/client';

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

@InputType()
export class CustomerInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  address?: string;

  @Field()
  phone: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  city?: string;
}

@InputType()
export class CartUpdateInput {
  @Field(() => [CartItemInput], { nullable: true })
  items?: CartItemInput[];

  @Field({ nullable: true })
  appliedCoupon?: string;

  @Field(() => CustomerInput, { nullable: true })
  customerInfo?: CustomerInput;

  @Field(() => PaymentMethods, { nullable: true })
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods, { nullable: true })
  deliveryMethod?: DeliveryMethods;
}
