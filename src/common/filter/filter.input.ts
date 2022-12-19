import { Field, InputType } from '@nestjs/graphql';
import { AttendanceType, ProductType } from '@prisma/client';

@InputType()
export class ProductFilterInput {
  @Field(() => ProductType)
  type?: ProductType;

  @Field(() => AttendanceType)
  attendanceType?: AttendanceType;
}

@InputType()
export class OrdersFilterInput {
  field: string;
  title?: string;
}
