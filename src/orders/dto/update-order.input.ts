import { InputType, Field } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, OrderStatus } from '@prisma/client';
import { IsEmail } from 'class-validator';

@InputType()
class UpdateCustomerInput {
  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => String)
  address?: string;

  @Field(() => String)
  phone?: string;

  @Field(() => String)
  @IsEmail()
  email?: string;

  @Field(() => String)
  city?: string;
}

@InputType()
export class UpdateOrderInput {
  @Field()
  customerInfo?: UpdateCustomerInput;

  @Field(() => OrderStatus)
  status?: OrderStatus;

  @Field(() => String)
  vendorId?: string;

  @Field(() => String)
  cartId?: string;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
}
