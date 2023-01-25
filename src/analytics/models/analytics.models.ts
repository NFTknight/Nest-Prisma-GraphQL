import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/models/product.model';
import { DeliveryMethodAnalytics } from './analytics.deliveryMethods.model';
import { PaymentMethodAnalytics } from './analytics.paymentMethods';

@ObjectType()
export class Analytics {
  @Field(() => DeliveryMethodAnalytics)
  deliveryMethods: DeliveryMethodAnalytics;

  @Field(() => PaymentMethodAnalytics)
  paymentMethods: PaymentMethodAnalytics;

  @Field(() => Int)
  numberOfOrders: number;
}
@ObjectType()
export class RevenueProductAnalytics {
  @Field(() => Product)
  product: Product;

  @Field(() => Float)
  revenue: number;
}
