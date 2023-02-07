import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
class GroupedMonth {
  @Field({ nullable: true })
  month: string;
}

@ObjectType()
class AvgMonthlySale {
  @Field(() => GroupedMonth, { nullable: true })
  _id: GroupedMonth;

  @Field(() => Float, { nullable: true })
  averageSale: number;
}

@ObjectType()
class VendorViewForHub extends Vendor {
  @Field(() => Int, { nullable: true })
  totalProductCount: number;

  @Field(() => Int, { nullable: true })
  workShopCount: number;

  @Field(() => Int, { nullable: true })
  serviceCount: number;

  @Field(() => Int, { nullable: true })
  productCount: number;

  @Field(() => Int, { nullable: true })
  orderCount: number;

  @Field(() => Float, { nullable: true })
  avgOrderSize: number;

  @Field(() => Float, { nullable: true })
  revenue: number;

  @Field(() => Int, { nullable: true })
  couponCount: number;

  @Field(() => Int, { nullable: true })
  categoryCount: number;

  @Field(() => [AvgMonthlySale], { nullable: true })
  avgMonthlySales: [AvgMonthlySale];
}

@ObjectType()
export class PaginatedVendors extends paginated(VendorViewForHub) {}
