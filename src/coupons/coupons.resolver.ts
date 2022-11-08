import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateCouponInput } from './dto/create-coupon.input';
import { UpdateCouponInput } from './dto/update-coupon.input';
import { Coupon } from './models/coupon.model';
import { CouponsService } from './coupons.service';

@Resolver(() => Coupon)
export class CouponsResolver {
  constructor(
    private readonly couponsService: CouponsService,
    private readonly vendorService: VendorsService
  ) {}

  @Query(() => Coupon)
  getCoupon(@Args('id') id: string): Promise<Coupon> {
    return this.couponsService.getCoupon(id);
  }

  @Query(() => [Coupon])
  getCoupons(@Args('vendorId', { nullable: true }) vendorId?: string) {
    return this.couponsService.getCoupons(vendorId);
  }

  @Mutation(() => Coupon)
  createCoupon(@Args('data') data: CreateCouponInput): Promise<Coupon> {
    return this.couponsService.createCoupon(data);
  }

  @Mutation(() => Coupon)
  updateCoupon(
    @Args('id') id: string,
    @Args('data') data: UpdateCouponInput
  ): Promise<Coupon> {
    return this.couponsService.updateCoupon(id, data);
  }

  @Mutation(() => Coupon)
  deleteCoupon(@Args('id') id: string): Promise<Coupon> {
    return this.couponsService.deleteCoupon(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() coupon: Coupon): Promise<Vendor> {
    return this.vendorService.getVendor(coupon.vendorId);
  }
}
