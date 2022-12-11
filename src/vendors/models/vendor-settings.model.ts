import { Field, ObjectType } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods } from '@prisma/client';
@ObjectType()
class DeliveryAreas {
  label: string;
  label_ar: string;
  active: boolean;
  charge: number;
}

@ObjectType()
export class VendorSettings {
  @Field(() => [PaymentMethods])
  paymentMethods: PaymentMethods[];

  @Field(() => [DeliveryMethods])
  deliveryMethods: DeliveryMethods[];

  @Field(() => [DeliveryAreas])
  deliveryAreas: DeliveryAreas[];
}
