import { InputType, Field } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, OrderStatus } from '@prisma/client';

@InputType()
export class UpdateOrderInput {
  @Field(() => OrderStatus)
  status?: OrderStatus;

  @Field()
  vendorId?: string;

  @Field()
  cartId?: string;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
}
