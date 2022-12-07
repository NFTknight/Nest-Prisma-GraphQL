import { Field, ObjectType } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods } from '@prisma/client';

@ObjectType()
export class VendorSettings {
  @Field(() => [PaymentMethods])
  paymentMethods: PaymentMethods[];

  @Field(() => [DeliveryMethods])
  deliveryMethods: DeliveryMethods[];
}
