import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { User } from 'src/users/models/user.model';
import { AddDeliveryAreasInput } from './dto/add-delivery-areas.input';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { EMAIL_OPTIONS, SendEmails } from 'src/utils/email';
import { Vendor } from '@prisma/client';

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
