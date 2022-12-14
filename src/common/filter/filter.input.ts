import { Field, InputType } from '@nestjs/graphql';
import { AttendanceType, ProductType } from '@prisma/client';

@InputType()
export class ProductFilterInput {
  field: string;
  title?: string;

  @Field(() => ProductType)
  type?: ProductType;
  priceUpperLimit?: number;
  priceLowerLimit?: number;

  @Field(() => AttendanceType)
  attendanceType?: AttendanceType;
}
