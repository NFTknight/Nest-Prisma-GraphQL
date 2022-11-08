import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateCouponInput } from './dto/create-coupon.input';
import { UpdateCouponInput } from './dto/update-coupon.input';
import { Coupon } from './models/coupon.model';

@Injectable()
export class CouponsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getCoupon(id: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });

    if (!coupon) throw new NotFoundException('Coupon Not Found.');

    return coupon;
  }

  async getCoupons(vendorId?: string): Promise<Coupon[]> {
    const where: Partial<Coupon> = {};
    if (vendorId) where.vendorId = vendorId;

    return this.prisma.coupon.findMany({ where });
  }

  async createCoupon(data: CreateCouponInput): Promise<Coupon> {
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);
    // if vendor exists we can successfully create the coupon.
    return this.prisma.coupon.create({ data });
  }

  async updateCoupon(id: string, data: UpdateCouponInput): Promise<Coupon> {
    return this.prisma.coupon.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteCoupon(id: string): Promise<Coupon> {
    return await this.prisma.coupon.delete({ where: { id } });
  }
}
