import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, AttendanceType, User, Role } from '@prisma/client';

import { throwNotFoundException } from 'src/utils/validation';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { GetProductArgs } from '../dto/product';
import { PaginatedProducts } from 'src/products/models/paginated-products.model';
import { GetVendorsArgs } from '../dto/vendor';
import { PaginatedVendors } from '../models/vendor';
import { SignupInput } from 'src/auth/dto/signup.input';
import { PasswordService } from 'src/auth/password.service';
import { PaginatedUsers } from '../models/user';
import { GetUsersArgs } from '../dto/user';
import { PaginatedOrders } from 'src/orders/models/paginated-orders.model';
import { GetOrderArgs } from '../dto/order';
import { GetCategoryArgs } from '../dto/category';
import { PaginatedCategories } from 'src/categories/models/paginated-categories.model';

@Injectable()
export class HubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  getProducts = async ({
    pg,
    sortOrder,
    filter,
  }: GetProductArgs): Promise<PaginatedProducts> => {
    try {
      const { skip, take } = getPaginationArgs(pg);
      const where: Prisma.ProductWhereInput = {};
      const orderBy = {};

      if (sortOrder) orderBy[sortOrder.field] = sortOrder.direction;
      else orderBy['createdAt'] = Prisma.SortOrder.asc;

      if (typeof filter.active === 'boolean') where['active'] = filter.active;

      if (filter.vendorId?.length) where['vendorId'] = { in: filter.vendorId };

      if (filter.categoryId?.length)
        where['categoryId'] = { in: filter.categoryId };

      if (filter.type?.length) where['type'] = { in: filter.type };

      if (filter.attendanceType?.length)
        where['attendanceType'] = { in: filter.attendanceType };

      const products = await this.prisma.product.findMany({
        where,
        skip,
        take: take || undefined,
        orderBy,
      });

      throwNotFoundException(products?.length, '', 'No product available');

      const list = [];
      for (const product of products) {
        product.badge = {
          ...product?.badge,
          label: product.meetingLink
            ? AttendanceType.ONLINE
            : AttendanceType.PHYSICAL,
        };

        const quantity = await this.prisma.workshop.aggregate({
          where: { productId: product.id },
          _sum: { quantity: true },
        });

        if (quantity?._sum?.quantity) {
          product.bookedSeats += quantity?._sum?.quantity;
        }

        list.push(product);
      }

      const totalCount = await this.prisma.product.count({ where });

      return {
        list,
        totalCount: totalCount || 0,
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  getVendors = async ({
    pg,
    sortOrder,
    filter,
  }: GetVendorsArgs): Promise<PaginatedVendors> => {
    try {
      const { skip, take } = getPaginationArgs(pg);
      let where: Prisma.VendorWhereInput = {};
      const orderBy = {};

      if (sortOrder) orderBy[sortOrder.field] = sortOrder.direction;
      else orderBy['createdAt'] = Prisma.SortOrder.asc;

      if (typeof filter.active === 'boolean')
        where = { ...where, active: filter.active };

      if (filter?.vendorId?.length)
        where = { ...where, id: { in: filter?.vendorId } };

      if (filter?.name?.length)
        where = { ...where, name: { in: filter?.name } };

      if (filter?.name_ar?.length)
        where = { ...where, name_ar: { in: filter?.name_ar } };

      if (filter?.slug?.length)
        where = { ...where, slug: { in: filter?.slug } };

      if (filter?.email?.length)
        where = { ...where, info: { email: filter?.email } };

      const vendors = await this.prisma.vendor.findMany({
        where,
        skip,
        take: take || undefined,
        orderBy,
      });

      throwNotFoundException(vendors?.length, '', 'No vendor available');

      const totalCount = await this.prisma.vendor.count({ where });

      return {
        list: vendors,
        totalCount: totalCount || 0,
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  getUsers = async ({
    pg,
    sortOrder,
    filter,
  }: GetUsersArgs): Promise<PaginatedUsers> => {
    try {
      const { skip, take } = getPaginationArgs(pg);
      let where: Prisma.UserWhereInput = {};
      const orderBy = {};

      if (sortOrder) orderBy[sortOrder.field] = sortOrder.direction;
      else orderBy['createdAt'] = Prisma.SortOrder.asc;

      if (typeof filter.verified === 'boolean')
        where = { ...where, verified: filter.verified };

      if (filter?.userId?.length)
        where = { ...where, id: { in: filter?.userId } };

      if (filter?.email?.length)
        where = { ...where, email: { in: filter?.email } };

      if (filter?.role?.length)
        where = { ...where, role: { in: filter?.role } };

      const users = await this.prisma.user.findMany({
        where,
        skip,
        take: take || undefined,
        orderBy,
      });

      throwNotFoundException(users?.length, '', 'No user available');

      const totalCount = await this.prisma.user.count({ where });

      return {
        list: users,
        totalCount: totalCount || 0,
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  getOrders = async ({
    pg,
    sortOrder,
    filter,
  }: GetOrderArgs): Promise<PaginatedOrders> => {
    try {
      const { skip, take } = getPaginationArgs(pg);
      const where: Prisma.OrderWhereInput = {};
      const orderBy = {};

      if (sortOrder) orderBy[sortOrder.field] = sortOrder.direction;
      else orderBy['createdAt'] = Prisma.SortOrder.asc;

      if (filter.orderId?.length) where['orderId'] = { in: filter.orderId };

      if (filter.vendorId?.length) where['vendorId'] = { in: filter.vendorId };

      if (filter.productId?.length)
        where['items.productId'] = { in: filter.productId };

      if (filter.productId?.length)
        where['items'] = {
          some: {
            productId: { in: filter.productId },
          },
        };

      if (filter.email?.length)
        where['customerInfo'] = {
          is: {
            email: { in: filter.email },
          },
        };

      if (filter.status?.length) where['status'] = { in: filter.status };

      const orders = await this.prisma.order.findMany({
        where,
        skip,
        take: take || undefined,
        orderBy,
      });

      throwNotFoundException(orders?.length, '', 'No order available');

      const totalCount = await this.prisma.order.count({ where });

      return {
        list: orders,
        totalCount: totalCount || 0,
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  getCategories = async ({
    pg,
    sortOrder,
    filter,
  }: GetCategoryArgs): Promise<PaginatedCategories> => {
    try {
      const { skip, take } = getPaginationArgs(pg);
      const where: Prisma.CategoryWhereInput = {};
      const orderBy = {};

      if (sortOrder) orderBy[sortOrder.field] = sortOrder.direction;
      else orderBy['createdAt'] = Prisma.SortOrder.asc;

      if (typeof filter.active === 'boolean') where['active'] = filter.active;

      if (filter.vendorId?.length) where['vendorId'] = { in: filter.vendorId };

      if (filter.title?.length) where['title'] = { in: filter.title };

      if (filter.slug?.length) where['slug'] = { in: filter.slug };

      const categories = await this.prisma.category.findMany({
        where,
        skip,
        take: take || undefined,
        orderBy,
      });

      throwNotFoundException(categories?.length, '', 'No category available');

      const totalCount = await this.prisma.category.count({ where });

      return {
        list: categories,
        totalCount: totalCount || 0,
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  createAgent = async (payload: SignupInput): Promise<User> => {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      return await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          role: payload.role || Role.VENDOR,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(e);
    }
  };
}
