import { Field, ObjectType } from '@nestjs/graphql';
import { DeliveryMethodAnalytics } from './analytics.deliveryMethods.model';
import { PaymentMethodAnalytics } from './analytics.paymentMethods';

@ObjectType()
export class Analytics {
  @Field(() => DeliveryMethodAnalytics)
  deliveryMethods: DeliveryMethodAnalytics;

  @Field(() => PaymentMethodAnalytics)
  paymentMethods: PaymentMethodAnalytics;
}
