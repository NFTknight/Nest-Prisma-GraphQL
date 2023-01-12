import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { throwNotFoundException } from 'src/utils/validation';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateFormInput, UpdateFormInput } from './dto/form.input';
import { Form } from './models/forms.model';

@Injectable()
export class FormService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getForm(id: string): Promise<Form> {
    if (!id) return null;

    const form = await this.prisma.form.findUnique({
      where: { id },
    });

    throwNotFoundException(form, 'Form');

    return form;
  }

  async getForms(vendorId: string, pg?: PaginationArgs): Promise<Form[]> {
    try {
      const { skip, take } = getPaginationArgs(pg);
      const where = {
        vendorId,
      };
      return await this.prisma.form.findMany({
        where,
        skip,
        take: take || undefined,
      });
    } catch (err) {
      console.log('Err => ', err);
    }
  }

  async createForm(data: CreateFormInput): Promise<Form> {
    const { vendorId, ...rest } = data;
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);

    return await this.prisma.form.create({
      data: {
        ...rest,
        vendor: { connect: { id: vendorId } },
      },
    });
  }
  async updateForm(formId: string, data: UpdateFormInput): Promise<Form> {
    // if the vendor does not exist, this function will throw an error.
    if (data?.vendorId) {
      await this.vendorService.getVendor(data.vendorId);
    }
    return await this.prisma.form.update({ where: { id: formId }, data });
  }

  async deleteForm(id: string): Promise<Form> {
    return await this.prisma.form.delete({ where: { id } });
  }
}
