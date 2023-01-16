import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProductsService } from 'src/products/services/products.service';
import { OrderStatus, PaymentMethods } from '@prisma/client';
import { VendorsService } from 'src/vendors/vendors.service';
import { nanoid } from 'nanoid';
import { Workshop } from './models/workshop.model';
import { throwNotFoundException } from 'src/utils/validation';
import { CreateWorkshopInput } from './dto/workshops.input';
@Injectable()
export class WorkshopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService,
    private readonly vendorService: VendorsService
  ) {}

  async getWorkshop(id: string): Promise<Workshop> {
    if (!id) return null;
    const workshop = await this.prisma.workshop.findUnique({ where: { id } });

    throwNotFoundException(workshop, 'Booking');

    return workshop;
  }

  async createWorkshop(data: CreateWorkshopInput): Promise<Workshop> {
    const { productId, cartId } = data;

    const workshop = this.prisma.workshop.create({
      data: {
        productId,
        cartId,
      },
    });
    return workshop;
  }

  // async getBookings(where: any): Promise<Booking[]> {
  //   const res = await this.prisma.booking.findMany({ where });

  //   // this seems a overkill here, this can be removed
  //   throwNotFoundException(res, 'Booking', 'Booking not founds');

  //   return res;
  // }

  // async getAllBookings(
  //   pg?: PaginationArgs,
  //   sortOrder?: SortOrder
  // ): Promise<PaginatedBookings> {
  //   try {
  //     const { skip, take } = getPaginationArgs(pg);
  //     let orderBy = {};
  //     if (sortOrder) {
  //       orderBy[sortOrder.field] = sortOrder.direction;
  //     } else {
  //       orderBy = {
  //         updatedAt: 'desc',
  //       };
  //     }

  //     const list = await this.prisma.booking.findMany({
  //       skip,
  //       take: take || undefined,
  //       orderBy,
  //     });

  //     // this seems a overkill here, this can be removed
  //     throwNotFoundException(list, 'Booking', 'Booking not founds');

  //     const totalCount = await this.prisma.booking.count();

  //     return {
  //       list,
  //       totalCount,
  //     };
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }

  // CreateBookingInput
  // async createBooking(data: any): Promise<Workshop> {
  //   const { vendorId, customerInfo, productId, tagId, slots, status } = data;
  //   // if the cart/product or order does not exist, this function will throw an error.
  //   const product = await this.productService.getProduct(productId);

  //   throwNotFoundException(product, 'Product');

  //   await this.vendorService.getVendor(vendorId);

  //   /*
  //    * Commenting slot validation as this endpoint will use by vendor to create booking.*
  //    */
  //   // const tag = await this.tagService.getTag(tagId);
  //   // if all of these exist we can successfully create the booking.

  //   /*  let isAvailable = false;
  //   slots.forEach((slot) => {
  //     const from = new Date(`${slot?.from} UTC` || null);
  //     const to = new Date(`${slot?.to} UTC` || null);
  //     tag.workdays.some((workday) => {
  //       if (
  //         workday.day === days[from.getUTCDay() - 1] &&
  //         checkIfTimeInRange(from, to, workday.from, workday.to)
  //       ) {
  //         isAvailable = true;
  //         return true;
  //       }
  //     });
  //   });

  //   throwNotFoundException(isAvailable, '', 'Slot is not available'); */

  //   const vendorPrefix = await this.vendorService.getVendorOrderPrefix(
  //     vendorId
  //   );
  //   const orderId = `${vendorPrefix}-${nanoid(8)}`.toUpperCase();

  //   const productVariant = product?.variants?.[0];

  //   throwNotFoundException(productVariant, '', 'Product Variant not found!');

  //   const order = await this.prisma.order.create({
  //     data: {
  //       orderId,
  //       items: [
  //         {
  //           tagId,
  //           quantity: slots.length,
  //           price: productVariant.price,
  //           productId,
  //           slots,
  //           sku: productVariant.sku,
  //         },
  //       ],
  //       totalPrice: productVariant.price * slots.length,
  //       finalPrice: productVariant.price * slots.length,
  //       customerInfo,
  //       customerId: customerInfo.email,
  //       status: OrderStatus.CONFIRMED,
  //       paymentMethod: PaymentMethods.STORE,
  //     },
  //   });

  //   if (!order)
  //     throw new InternalServerErrorException('Order creation failed!');

  //   return this.prisma.booking.create({
  //     data: {
  //       orderId: order.id,
  //       vendor: { connect: { id: vendorId } },
  //       tag: { connect: { id: tagId } },
  //       product: { connect: { id: productId } },
  //       slots,
  //       status,
  //     },
  //   });
  // }

  // async updateBooking(id: string, data: UpdateBookingInput): Promise<Booking> {
  //   if (data.orderId) {
  //     await this.orderService.getOrder(data.orderId);
  //   }
  //   // remove booking holdtimestamp when order is created for this booking
  //   if ((data.status && data.status !== BookingStatus.HOLD) || data.orderId) {
  //     await this.prisma.$runCommandRaw({
  //       update: 'Booking',
  //       updates: [
  //         {
  //           q: { _id: { $eq: { $oid: id } } },
  //           u: { $unset: { holdTimestamp: '' } },
  //         },
  //       ],
  //     });
  //   }
  //   return this.prisma.booking.update({
  //     where: { id },
  //     data: { ...data, updatedAt: new Date() },
  //   });
  // }

  // async deleteBooking(id: string): Promise<Booking> {
  //   return await this.prisma.booking.delete({ where: { id } });
  // }
}
