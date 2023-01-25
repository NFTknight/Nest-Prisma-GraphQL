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
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginatedCoupons } from './models/paginated-coupons.model';
import { Cart } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { throwNotFoundException } from 'src/utils/validation';
import { Cart as CartModel } from '../cart/models/cart.model';

@Resolver(() => Coupon)
export class CouponsResolver {
  constructor(
    private readonly couponsService: CouponsService,
    private readonly prismaService: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  @Query(() => Coupon)
  getCoupon(@Args('id') id: string): Promise<Coupon> {
    return this.couponsService.getCoupon(id);
  }

  @Query(() => PaginatedCoupons)
  getCoupons(
    @Args('vendorId', { nullable: true }) vendorId?: string,
    @Args('pagination', { nullable: true }) pg?: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder?: SortOrder
  ): Promise<PaginatedCoupons> {
    return this.couponsService.getCoupons(vendorId, pg, sortOrder);
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

  @Mutation(() => CartModel)
  async addCouponToCart(
    @Args('id') id: string,
    @Args('cartId') cartId: string
  ): Promise<Cart> {
    const cart = await this.prismaService.cart.findUnique({
      where: { id: cartId },
    });

    const coupon = await this.prismaService.coupon.findFirst({
      where: { code: id, active: true },
    });

    const vendor = await this.prismaService.vendor.findUnique({
      where: { id: cart.vendorId },
    });

    throwNotFoundException(cart, 'Cart');
    throwNotFoundException(coupon, 'Coupon');
    throwNotFoundException(vendor, 'Vendor');

    const deliveryCharges = cart?.deliveryCharges || 0;
    const discountedAmount = (cart.subTotal * coupon.discount) / 100;

    const updatedCart = await this.prismaService.cart.update({
      where: {
        id: cartId,
      },

      data: {
        appliedCoupon: id,
        finalPrice: cart.subTotal - discountedAmount,
        totalPrice: cart.subTotal - discountedAmount + deliveryCharges,
      },
    });

    return updatedCart;
  }

  @Mutation(() => CartModel)
  async removeCouponFromCart(
    @Args('id') id: string,
    @Args('cartId') cartId: string
  ): Promise<Cart> {
    const cart = await this.prismaService.cart.findUnique({
      where: { id: cartId },
    });

    const coupon = await this.prismaService.coupon.findFirst({
      where: { code: id },
    });

    throwNotFoundException(cart, 'Cart');
    throwNotFoundException(coupon, 'Coupon');

    const updatedCart = await this.prismaService.cart.update({
      where: {
        id: cartId,
      },
      data: {
        appliedCoupon: null,
        finalPrice: cart.subTotal,
        totalPrice: cart.subTotal + cart.deliveryCharges,
      },
    });

    return updatedCart;
  }

  @ResolveField('vendor')
  vendor(@Parent() coupon: Coupon): Promise<Vendor> {
    return this.vendorService.getVendor(coupon.vendorId);
  }
}
