import { Field, InputType } from '@nestjs/graphql';
import { AttendanceType, Prisma, ProductType } from '@prisma/client';

@InputType()
export class ProductFilterInput implements Prisma.ProductWhereInput {
  @Field(() => ProductType)
  type?: ProductType;

  @Field(() => AttendanceType)
  attendanceType?: AttendanceType;

  title?: string;
  slug?: string;
  title_ar?: string;
}

@InputType()
export class OrdersFilterInput {
  field: string;
  title?: string;
}
