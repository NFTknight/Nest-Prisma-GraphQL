import { registerEnumType } from '@nestjs/graphql';
import { ProductType, AttendanceType } from 'prisma/prisma-client';

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'Product Type',
});

registerEnumType(AttendanceType, {
  name: 'AttendanceType',
  description: 'Attendance Type',
});
