import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { User } from 'src/users/models/user.model';
import { AddDeliveryAreasInput } from './dto/add-delivery-areas.input';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { EMAIL_OPTIONS, SendEmails } from 'src/utils/email';
import { Vendor } from '@prisma/client';
import { VendorView } from './vendors.module';

@Injectable()
export class VendorsService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: SendgridService
  ) {}

  async createVendor(
    createVendorInput: CreateVendorInput,
    user: User
  ): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { ownerId: user.id },
    });

    if (vendor) throw new BadRequestException('Vendor Already Exists For User');

    const res = await this.prisma.vendor.create({
      data: { ...createVendorInput, ownerId: user.id },
    });

    this.emailService.send(
      SendEmails(EMAIL_OPTIONS.WELCOME_VENDOR, user.email)
    );

    return res;
  }

  updateVendor(
    id: string,
    updateVendorInput: UpdateVendorInput
  ): Promise<Vendor> {
    return this.prisma.vendor.update({
      data: { ...updateVendorInput, updatedAt: new Date() },
      where: { id },
    });
  }

  deleteVendor(id: string): Promise<Vendor> {
    return this.prisma.vendor.delete({ where: { id } });
  }

  async getVendor(id: string): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id },
    });

    if (!vendor) throw new NotFoundException('Vendor Not Found');

    return vendor;
  }

  async getVendorView(vendorId: string): Promise<VendorView> {
    const numberProductsPromise = this.prisma.product.count({
      where: { vendorId },
    });
    const numberOrdersPromise = this.prisma.order.count({
      where: { vendorId },
    });

    const numberServicesPromise = this.prisma.product.count({
      where: { vendorId: vendorId, type: 'SERVICE' },
    });
    const numberBookingsPromise = this.prisma.booking.count({
      where: { vendorId },
    });
    const numberCategoriesPromise = this.prisma.category.count({
      where: { vendorId },
    });
    const numberCouponsPromise = this.prisma.coupon.count({
      where: { vendorId },
    });
    const vendorPromise = this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    const [
      numberProducts,
      numberOrders,
      numberServices,
      numberBookings,
      numberCategories,
      numberCoupons,
      vendor,
    ] = await Promise.all([
      numberProductsPromise,
      numberOrdersPromise,
      numberServicesPromise,
      numberBookingsPromise,
      numberCategoriesPromise,
      numberCouponsPromise,
      vendorPromise,
    ]);

    const ownerId = vendor.ownerId;
    const vendorOwner = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });
    const accountManager =
      (vendorOwner.firstName || '') + ' ' + (vendorOwner.lastName || '');

    return {
      numberProducts,
      numberOrders,
      numberServices,
      numberBookings,
      numberCategories,
      numberCoupons,
      accountManager,
    };
  }

  async getVendorByUserId(id: string): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { ownerId: id },
    });

    if (!vendor) throw new NotFoundException('Vendor Not Found');

    return vendor;
  }

  async getVendorBySlug(slug: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { slug },
    });

    if (!vendor) throw new NotFoundException('Vendor Not Found');

    return vendor;
  }

  getVendors(): Promise<Vendor[]> {
    return this.prisma.vendor.findMany();
  }

  addDeliveryAreas(
    id: string,
    areas: AddDeliveryAreasInput[]
  ): Promise<Vendor> {
    return this.prisma.vendor.update({
      data: {
        settings: {
          upsert: {
            set: {
              deliveryAreas: areas,
            },
            update: {
              deliveryAreas: areas,
            },
          },
        },
      },
      where: { id },
    });
  }
}
