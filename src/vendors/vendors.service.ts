import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorInput } from './dto/createVendor.input';
import { UpdateVendorInput } from './dto/updateVendor.input';
import { Vendor } from './models/vendor.model';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  getVendor(id: string): Promise<Vendor> {
    const vendor = this.prisma.vendor.findFirst({ where: { id } });

    if (!vendor) throw new NotFoundException('Vendor Not Found');

    return vendor;
  }

  getVendors() {
    return this.prisma.vendor.findMany();
  }

  createVendor(createVendorInput: CreateVendorInput) {
    return this.prisma.vendor.create({ data: createVendorInput });
  }

  updateVendor(id: string, updateVendorInput: UpdateVendorInput) {
    return this.prisma.vendor.update({
      data: updateVendorInput,
      where: { id },
    });
  }

  deleteVendor(id: string) {
    return this.prisma.vendor.delete({ where: { id } });
  }
}
