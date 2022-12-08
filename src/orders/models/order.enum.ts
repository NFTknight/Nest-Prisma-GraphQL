import { registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order status',
});
