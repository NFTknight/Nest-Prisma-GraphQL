import { Field, ObjectType } from '@nestjs/graphql';
import {
  DeliveryMethods,
  PaymentMethods,
  DeliveryAreas as PrismaDeliveryAreas,
} from '@prisma/client';

@ObjectType()
export class DeliveryAreas implements PrismaDeliveryAreas {
  @Field()
  label: string;
  @Field()
  label_ar: string;
  @Field()
  active: boolean;
  @Field()
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
