import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Order } from './order.model';

@ObjectType()
export class PaginatedOrders extends paginated(Order) {}
