import { Field, ObjectType } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, DeliveryAreas } from '@prisma/client';

@ObjectType()
export class VendorSettings {
  @Field(() => [PaymentMethods])
  paymentMethods: PaymentMethods[];

  @Field(() => [DeliveryMethods])
  deliveryMethods: DeliveryMethods[];

  // @Field(() => [DeliveryAreas])
  // deliveryAreas: DeliveryAreas[];
}
