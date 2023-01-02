import { Field, InputType } from '@nestjs/graphql';
import {
  AttendanceType,
  Prisma,
  ProductType,
  OrderStatus,
  DeliveryMethods,
  PaymentMethods,
} from '@prisma/client';

@InputType()
export class ProductFilterInput implements Prisma.ProductWhereInput {
  @Field(() => ProductType)
  type?: ProductType;

  @Field(() => AttendanceType)
  attendanceType?: AttendanceType;
}

@InputType()
export class OrdersFilterInput implements Prisma.OrderWhereInput {
  @Field(() => OrderStatus)
  status?: OrderStatus;
  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
  @Field(() => PaymentMethods)
  PaymentMethods?: PaymentMethods;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}
