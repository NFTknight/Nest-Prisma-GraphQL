import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeliveryMethods,
  Order,
  OrderStatus,
  Prisma,
  ProductType,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartService } from 'src/cart/cart.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { EMAIL_OPTIONS, SendEmails } from 'src/utils/email';
import { VendorsService } from 'src/vendors/vendors.service';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { OrdersFilterInput } from 'src/common/filter/filter.input';
import { WayBill } from 'src/shipping/models/waybill.model';
import { ShippingService } from 'src/shipping/shipping.service';

import { UpdateOrderInput } from './dto/update-order.input';
import { PaginatedOrders } from './models/paginated-orders.model';
import { ProductsService } from 'src/products/services/products.service';
import { throwNotFoundException } from 'src/utils/validation';

@Injectable()
export class OrdersService {
  constructor(
    private readonly cartService: CartService,
    private readonly emailService: SendgridService,
    private readonly prisma: PrismaService,
    private readonly shippingService: ShippingService,
    private readonly vendorService: VendorsService,
    private readonly productsService: ProductsService
  ) {}

  async getOrder(id: string) {
    if (!id) return null;
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    throwNotFoundException(order, 'Order');

    const updatedItems = [];

    for (const item of order.items) {
      let Tag = null;

      if (item?.tagId) {
        Tag = await this.prisma.tag.findUnique({
          where: { id: item.tagId },
        });
      }

      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      const variant = product?.variants?.find(
        (variant) => variant.sku === item.sku
      );

      updatedItems.push({
        ...item,
        Tag,
        title: variant?.title || '',
        title_ar: variant?.title_ar || '',
      });
    }

    return { ...order, items: updatedItems };
  }

  async getOrders(
    vendorId: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder,
    filter?: OrdersFilterInput
  ): Promise<PaginatedOrders> {
    try {
      const { skip, take } = getPaginationArgs(pg);

      let orderBy = {};

      let where: Prisma.OrderWhereInput = {
        vendorId,
      };

      if (sortOrder) {
        orderBy[sortOrder.field] = sortOrder.direction;
      } else {
        orderBy = { id: 'asc' };
      }

      if (filter) {
        const { firstName, lastName, phone, email, ...restFilters } = filter;
        where = { ...where, ...restFilters };

        if (firstName || lastName || phone || email) {
          where = {
            ...where,
            customerInfo: {
              is: {
                firstName,
                lastName,
                phone,
                email,
              },
            },
          };
        }
      }

      const res = await this.prisma.$transaction([
        this.prisma.order.count({ where }),
        this.prisma.order.findMany({
          where,
          skip,
          take: take || undefined,
          orderBy,
        }),
      ]);

      throwNotFoundException(res, '', 'Data not found!');

      return { totalCount: res[0], list: res[1] };
    } catch (err) {
      console.log('Err => ', err);
      throw new Error(err);
    }
  }

  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    let wayBillData: WayBill = null;

    const order = await this.getOrder(id);
    const vendorData = await this.vendorService.getVendor(order.vendorId);

    if (
      (data.status === OrderStatus.PENDING ||
        order.status === OrderStatus.PENDING) &&
      order.deliveryMethod === DeliveryMethods.SMSA &&
      !order.wayBill
    ) {
      wayBillData = await this.cartService.createWayBillData(order, vendorData);
    }

    let updatingOrderObject: any = data;

    if (wayBillData?.sawb) {
      updatingOrderObject = { ...updatingOrderObject, wayBill: wayBillData };
    }

    const res = await this.prisma.order.update({
      where: { id },
      data: { ...updatingOrderObject, updatedAt: new Date() },
    });

    // Email notification to vendor and customer if order is confirmed or rejected
    if (
      res.id &&
      (data.status === OrderStatus.CONFIRMED ||
        data.status === OrderStatus.REJECTED)
    ) {
      // Email notification
      this.emailService.send(SendEmails(data.status, res.customerInfo.email));
      if (vendorData?.info?.email) {
        this.emailService.send(SendEmails(data.status, vendorData.info.email));
      } else {
        // if vendor info doesn't have email
        const user = await this.prisma.user.findUnique({
          where: { id: vendorData?.ownerId },
        });
        if (user) this.emailService.send(SendEmails(data.status, user.email));
      }
    }

    // if order is rejected delete all bookings otherwise update the status to PENDING OR CONFIRMED
    if (res.id) {
      if (data.status === OrderStatus.REJECTED) {
        await this.prisma.booking.deleteMany({ where: { orderId: res.id } });
        for (const item of order.items) {
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (product.type === ProductType.WORKSHOP) {
            await this.prisma.product.update({
              where: { id: product.id },
              data: {
                bookedSeats: product.bookedSeats - item.quantity,
              },
            });
          }
        }
      } else if (
        data.status === OrderStatus.PENDING ||
        data.status === OrderStatus.CONFIRMED
      ) {
        await this.prisma.booking.updateMany({
          where: { orderId: res.id },
          data: {
            status: data.status,
          },
        });

        if (
          (data.status === OrderStatus.PENDING ||
            order.status === OrderStatus.PENDING) &&
          res.cartId
        ) {
          // remove cart: all details are now in order
          await this.prisma.cart.delete({ where: { id: res.cartId } });

          // decrement product's variant's quantity as order is now created
          await this.productsService.decrementProductVariantQuantities(
            order?.items || []
          );
        }

        if (data.status === OrderStatus.CONFIRMED) {
          for (const item of order.items) {
            const product = await this.productsService.getProduct(
              item.productId
            );
            if (product.type === ProductType.WORKSHOP) {
              await this.prisma.product.update({
                where: { id: product.id },
                data: {
                  bookedSeats: {
                    increment: item.quantity,
                  },
                },
              });
            }
          }
        }
      }
    }

    if (
      order.status !== OrderStatus.PENDING &&
      data.status === OrderStatus.PENDING
    ) {
      const vendor = await this.prisma.vendor.findUnique({
        where: { id: order.vendorId },
      });
      if (vendor.slug === 'somatcha') {
        for (const item of order.items) {
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (product.type === ProductType.WORKSHOP) {
            this.emailService.send(
              SendEmails(
                EMAIL_OPTIONS.WORKSHOP_DETAILS,
                order?.customerInfo?.email,
                '',
                {
                  orderID: order.id,
                  workshop: {
                    title: product.title,
                    title_ar: product.title_ar,
                    description: product.description,
                    description_ar: product.description_ar,
                    date: product.startDate,
                    startTime: product.startDate,
                    endTime: product.endDate,
                  },
                  attendee: {
                    firstName: order.customerInfo.firstName,
                    lastName: order.customerInfo.lastName,
                    phone: order.customerInfo.phone,
                  },
                }
              )
            );
          }
        }
      }
    }

    return { ...res, ...updatingOrderObject, updatedAt: new Date() };
  }

  async deleteOrder(id: string): Promise<Order> {
    return await this.prisma.order.delete({ where: { id } });
  }

  async verifyQRCode(orderId: string, qrOTP: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    throwNotFoundException(order, 'Order');

    if (order?.qrVerified)
      throw new BadRequestException('QR code is already verified');

    let isOTPverified = false;

    for (const item of order.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item?.productId },
      });

      if (product?.type === ProductType.WORKSHOP && product?.qrOTP === qrOTP) {
        isOTPverified = true;
      }
    }

    if (!isOTPverified) throw new BadRequestException('QR code is not valid');

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        qrVerified: isOTPverified,
      },
    });
  }
}
