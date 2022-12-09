import { InputType, Field } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, OrderStatus } from '@prisma/client';
import { IsEmail } from 'class-validator';

@InputType()
class UpdateCustomerInput {
  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field()
  address?: string;

  @Field()
  phone?: string;

  @Field()
  @IsEmail()
  email?: string;

  @Field()
  city?: string;
}

@InputType()
export class UpdateOrderInput {
  @Field(() => OrderStatus)
  status?: OrderStatus;

  @Field()
  vendorId?: string;

  @Field()
  cartId?: string;

  // @Field()
  // customerInfo?: UpdateCustomerInput;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
}
