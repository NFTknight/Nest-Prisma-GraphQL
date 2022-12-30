import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Booking } from './booking.model';

@ObjectType()
export class PaginatedBookings extends paginated(Booking) {}
