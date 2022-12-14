import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, OrderStatus } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order Status',
});

@InputType()
class CreateCustomerInput {
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
export class CreateOrderInput {
  @Field()
  @IsNotEmpty()
  customerInfo: CreateCustomerInput;

  @Field(() => OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  @IsNotEmpty()
  cartId: string;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
}
