import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Coupon } from './coupon.model';

@ObjectType()
export class PaginatedCoupons extends paginated(Coupon) {}
