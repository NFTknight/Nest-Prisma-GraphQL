import { Injectable } from '@nestjs/common';
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
import { SendEmails } from 'src/utils/email';
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

  async getOrder(id: string): Promise<Order> {
    if (!id) return null;
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    throwNotFoundException(order, 'Order');

    return order;
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

        if (data.status === OrderStatus.PENDING && res.cartId) {
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

    return { ...res, ...updatingOrderObject, updatedAt: new Date() };
  }

  async deleteOrder(id: string): Promise<Order> {
    return await this.prisma.order.delete({ where: { id } });
  }
}
