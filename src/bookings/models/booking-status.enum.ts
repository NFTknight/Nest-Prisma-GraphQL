import { registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from 'prisma/prisma-client';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Booking Status',
});
