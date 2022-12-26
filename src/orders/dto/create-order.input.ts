import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, OrderStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order Status',
});

@InputType()
export class CreateOrderInput {
  @Field(() => OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @Field()
  @IsNotEmpty()
  cartId: string;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
}
