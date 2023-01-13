import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { User } from 'src/users/models/user.model';
import { AddDeliveryAreasInput } from './dto/add-delivery-areas.input';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { EMAIL_OPTIONS, SendEmails } from 'src/utils/email';
import { Vendor } from '@prisma/client';
import { VendorView } from './models/vendor.model';
import { throwNotFoundException } from 'src/utils/validation';
import { VendorFilterInput } from './dto/get-vendor-filter.input';

@Injectable()
export class VendorsService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: SendgridService
  ) {}

  async createVendor(
    createVendorInput: CreateVendorInput,
    user: User
  ): Promise<any> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { ownerId: user.id },
    });

    if (vendor) throw new BadRequestException('Vendor Already Exists For User');

    const res = await this.prisma.vendor.create({
      data: {
        ...createVendorInput,
        MF_vendorCode: 1,
        ownerId: user.id,
        info: {
          email: user.email,
        },
      },
    });

    this.emailService.send(
      SendEmails(EMAIL_OPTIONS.WELCOME_VENDOR, user.email)
    );

    const owner = await this.prisma.user.findUnique({ where: { id: user.id } });

    throwNotFoundException(owner, 'User');

    return { ...res, owner };
  }

  async updateVendor(id: string, updateVendorInput: UpdateVendorInput) {
    const updatedVendor = await this.prisma.vendor.update({
      data: { ...updateVendorInput, updatedAt: new Date() },
      where: { id },
    });
    const owner = await this.prisma.user.findUnique({
      where: { id: updatedVendor.ownerId },
    });

    throwNotFoundException(owner, 'User');

    return { ...updatedVendor, owner };
  }

  deleteVendor(id: string): Promise<Vendor> {
    return this.prisma.vendor.delete({ where: { id } });
  }

  async getVendor(id: string) {
    if (!id) return null;
    const vendor = await this.prisma.vendor.findFirst({
      where: { id },
    });

    throwNotFoundException(vendor, 'Vendor');
    const user = await this.prisma.user.findUnique({
      where: { id: vendor.ownerId },
    });

    throwNotFoundException(user, 'User');
    return { ...vendor, owner: user };
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

    throwNotFoundException(vendor, 'Vendor');

    const vendorName = vendor?.name || '';
    const vendorUrl = vendor?.info?.addressUrl || '';
    const ownerId = vendor.ownerId;

    const vendorOwner = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });

    const accountManager =
      (vendorOwner.firstName || '') + ' ' + (vendorOwner.lastName || '');

    return {
      vendorName,
      vendorUrl,
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

    throwNotFoundException(vendor, 'Vendor');

    return vendor;
  }

  async getVendorBySlug(slug: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { slug },
    });

    throwNotFoundException(vendor, 'Vendor');

    const owner = await this.prisma.vendor.findUnique({
      where: { id: vendor.ownerId },
    });

    throwNotFoundException(owner, 'User');

    return { ...vendor, owner };
  }

  getVendors(filter: VendorFilterInput): Promise<Vendor[]> {
    let where = {};
    if (typeof filter.active === 'boolean') {
      where = {
        ...where,
        active: filter.active,
      };
    }

    where = {
      active: filter.active || undefined,
      name: { in: filter?.name } || undefined,
      name_ar: { in: filter?.name_ar } || undefined,
    };

    return this.prisma.vendor.findMany({ where });
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

  async getVendorOrderPrefix(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { name: true },
    });

    throwNotFoundException(vendor, 'Vendor');

    let prefix = '';
    const vendorStrArr = vendor.name.split(' ');
    if (vendorStrArr.length === 1) {
      prefix = vendor.name.slice(0, 2).toUpperCase();
    } else if (vendorStrArr.length === 2) {
      prefix = vendorStrArr[0][0] + vendorStrArr[1][0];
    } else if (vendorStrArr.length > 2) {
      prefix = vendorStrArr[0][0] + vendorStrArr[vendorStrArr.length - 1][0];
    } else {
      // default vendor prefix if name doesn't exist for vendor
      prefix = 'VE';
    }
    return prefix;
  }
}
