import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { Vendor } from './models/vendor.model';
import { User } from 'src/users/models/user.model';
import { AddDeliveryAreasInput } from './dto/add-delivery-areas.input';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  createVendor(
    createVendorInput: CreateVendorInput,
    user: User
  ): Promise<Vendor> {
    return this.prisma.vendor.create({
      data: { ...createVendorInput, ownerId: user.id },
    });
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

  getVendorBySlug(slug: string) {
    return this.prisma.vendor.findFirst({ where: { slug } });
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
