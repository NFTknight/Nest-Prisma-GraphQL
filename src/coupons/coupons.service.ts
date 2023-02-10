import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateCouponInput } from './dto/create-coupon.input';
import { UpdateCouponInput } from './dto/update-coupon.input';
import { Coupon } from './models/coupon.model';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginatedCoupons } from './models/paginated-coupons.model';
import { throwNotFoundException } from 'src/utils/validation';

@Injectable()
export class CouponsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getCoupon(id: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });

    throwNotFoundException(coupon, 'Coupon');

    return coupon;
  }

  async getCoupons(
    vendorId?: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder
  ): Promise<PaginatedCoupons> {
    const { skip, take } = getPaginationArgs(pg);

    const where = {
      vendorId,
    };
    const res = await this.prisma.$transaction([
      this.prisma.coupon.count({ where }),
      this.prisma.coupon.findMany({ where, skip, take: take || undefined }),
    ]);
    return { totalCount: res[0], list: res[1] };
  }

  async createCoupon(data: CreateCouponInput): Promise<Coupon> {
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);
    // if vendor exists we can successfully create the coupon.
    const couponExists = await this.prisma.coupon.findFirst({
      where: { code: data.code, vendorId: data.vendorId },
    });

    if (couponExists)
      throw new BadRequestException('Coupon already exists for this code');

    return this.prisma.coupon.create({ data });
  }

  async updateCoupon(id: string, data: UpdateCouponInput): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    const couponExists = await this.prisma.coupon.findFirst({
      where: { code: data.code, vendorId: coupon.vendorId, NOT: { id } },
    });

    if (couponExists)
      throw new BadRequestException('Coupon already exists for this code');

    return this.prisma.coupon.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteCoupon(id: string): Promise<Coupon> {
    return await this.prisma.coupon.delete({ where: { id } });
  }
}
