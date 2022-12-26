import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductValidator } from 'src/utils/validation';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product, Prisma, AttendanceType, CartItem } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  async getProduct(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NotFoundException('Product Not Found.');
    if (product.meetingLink) {
      if (product.badge)
        product.badge = { ...product.badge, label: AttendanceType.ONLINE };
      else product.badge = { label: AttendanceType.ONLINE };
    } else if (product.location) {
      if (product.badge)
        product.badge = { ...product.badge, label: AttendanceType.PHYSICAL };
      else product.badge = { label: AttendanceType.PHYSICAL };
    }

    return product;
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const error = CreateProductValidator(data);
    if (error) throw new BadRequestException(error);

    const { vendorId, categoryId, variants, tags, formId, ...rest } = data;

    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(vendorId);

    // if vendor exists we can successfully create the product.
    const prod = await this.prisma.product.create({
      data: {
        ...rest,
        tagIds: tags ? { set: tags } : undefined,
        variants,
        vendor: { connect: { id: vendorId } },
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        form: formId ? { connect: { id: formId } } : undefined,
      },
    });

    if (tags && tags.length > 0) {
      await this.prisma.tag.updateMany({
        where: { id: { in: tags } },
        data: { productIds: { push: prod.id } },
      });
    }

    return prod;
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    const { categoryId, tags, formId, ...restData } = data;
    const updateData: Prisma.ProductUpdateArgs['data'] = {
      ...restData,
    };

    if (categoryId) {
      updateData.category = { connect: { id: categoryId } };
    }
    if (formId) {
      updateData.form = { connect: { id: formId } };
    }

    if (tags && tags.length > 0) {
      updateData.tagIds = { set: tags };
      const tagItems = await this.prisma.tag.findMany({
        where: {
          vendorId: product.vendorId,
        },
      });

      for (const tag of tagItems) {
        // remove the product from the tags that are not in the new list
        if (!tags.includes(tag.id)) {
          await this.prisma.tag.update({
            where: { id: tag.id },
            data: {
              productIds: { set: tag.productIds.filter((p) => p !== id) },
            },
          });
        }
        // add the product to the tags that are in the new list
        else if (!tag.productIds.includes(id)) {
          await this.prisma.tag.update({
            where: { id: tag.id },
            data: { productIds: { push: id } },
          });
        }
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    const prod = await this.prisma.product.findUnique({
      where: { id },
      include: { tags: true },
    });

    // remove the product from the tags
    for (const tag of prod.tags) {
      await this.prisma.tag.update({
        where: { id: tag.id },
        data: { productIds: { set: tag.productIds.filter((p) => p !== id) } },
      });
    }

    return await this.prisma.product.delete({ where: { id } });
  }

  async updateProductVariantQuantities(data: CartItem[]): Promise<boolean> {
    return Promise.all(
      data.map(async ({ productId, sku, quantity }): Promise<boolean> => {
        const product = await this.getProduct(productId);
        const variants = product.variants.map((item) => {
          if (item.sku === sku) {
            console.log({ item: item, quantity });
            if (item.quantity < quantity) {
              throw new BadRequestException(
                'Product Order quantity cannot be more than Product available quantity'
              );
            }
            return { ...item, quantity: item.quantity - quantity };
          }

          return item;
        });
        return !!(await this.prisma.product.update({
          where: { id: productId },
          data: { variants },
        }));
      })
    ).then((data) => {
      return data.every((item) => item === true);
    });

    return false;
  }
}

// Promise.all(arr.map(async (elem): Promise<number> => {
//   await asyncFunction();
//   return elem + 10;
// }));
