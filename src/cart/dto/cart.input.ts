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
export class CartAddressInput {
  @Field()
  contactName: string;

  @Field()
  contactPhoneNumber: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  addressLine1: string;

  @Field(() => String, { nullable: true })
  addressUrl: string;
}

@InputType()
export class CartUpdateInput {
  @Field(() => [CartItemInput])
  items?: CartItemInput[];

  @Field({ nullable: true })
  appliedCoupon?: string;

  @Field(() => CustomerInput, { nullable: true })
  customerInfo?: CustomerInput;

  @Field(() => PaymentMethods, { nullable: true })
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods, { nullable: true })
  deliveryMethod?: DeliveryMethods;

  @Field(() => CartAddressInput, { nullable: true })
  consigneeAddress?: CartAddressInput;

  @Field(() => CartAddressInput, { nullable: true })
  shippingAddress?: CartAddressInput;

  @Field(() => String, { nullable: true })
  deliveryArea?: string;

  @Field(() => Float, { nullable: true })
  subTotal?: number;

  @Field(() => Float, { nullable: true })
  totalPrice?: number;
}
