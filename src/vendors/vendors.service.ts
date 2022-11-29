import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorInput } from './dto/createVendor.input';
import { UpdateVendorInput } from './dto/updateVendor.input';
import { Vendor } from './models/vendor.model';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

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

  createVendor(createVendorInput: CreateVendorInput): Promise<Vendor> {
    return this.prisma.vendor.create({ data: createVendorInput });
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
}
