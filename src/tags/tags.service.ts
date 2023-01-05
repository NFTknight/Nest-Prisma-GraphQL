import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './models/tag.model';
import getPaginationArgs from 'src/common/helpers/getPaginationArgs';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginatedTags } from './models/paginated-tags.model';
import * as dayjs from 'dayjs';
import * as Duration from 'dayjs/plugin/duration';
import * as Utc from 'dayjs/plugin/utc';
import * as Timezone from 'dayjs/plugin/timezone';
import * as Between from 'dayjs/plugin/isBetween';
import { find } from 'lodash';
import { throwNotFoundException } from 'src/utils/validation';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {
    dayjs.extend(Duration);
    dayjs.extend(Utc);
    dayjs.extend(Timezone);
    dayjs.extend(Between);
  }

  async getTag(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    throwNotFoundException(tag, 'Tag');

    return tag;
  }

  async getTags(
    vendorId?: string,
    pg?: PaginationArgs,
    sortOrder?: SortOrder
  ): Promise<PaginatedTags> {
    const { skip, take } = getPaginationArgs(pg);

    const where = {
      vendorId,
    };
    const res = await this.prisma.$transaction([
      this.prisma.tag.count({ where }),
      this.prisma.tag.findMany({ where, skip, take }),
    ]);
    return { totalCount: res[0], list: res[1] };
  }

  async getTagsByProduct(productId: string): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: { productIds: { has: productId } },
    });
  }

  async createTag(data: CreateTagInput): Promise<Tag> {
    // if the vendor does not exist, this function will throw an error.
    await this.vendorService.getVendor(data.vendorId);
    // if vendor exists we can successfully create the category.
    return this.prisma.tag.create({ data });
  }

  async updateTag(id: string, data: UpdateTagInput): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    throwNotFoundException(tag, 'Tag');

    const products = await this.prisma.product.findMany({
      where: { vendorId: tag.vendorId },
    });

    if (products.length > 0) {
      for (const product of products) {
        // remove the tag from products that do not have it.
        if (!data.productIds?.includes(product.id)) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              tagIds: { set: product.tagIds.filter((tagId) => tagId !== id) },
            },
          });
        }
        // add the tag to products that do not have it.
        else if (!product.tagIds.includes(id)) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              tagIds: { set: [...product.tagIds, id] },
            },
          });
        }
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteTag(id: string): Promise<Tag> {
    const products = await this.prisma.product.findMany({
      where: { tagIds: { has: id } },
    });

    if (products.length > 0) {
      for (const product of products) {
        await this.prisma.product.update({
          where: { id: product.id },
          data: {
            tagIds: { set: product.tagIds.filter((tagId) => tagId !== id) },
          },
        });
      }
    }

    return await this.prisma.tag.delete({ where: { id } });
  }

  async getTagAvailabilityByDate(id: string, date: Date, productId: string) {
    const [tag, product, bookings] = await this.prisma.$transaction([
      this.prisma.tag.findFirstOrThrow({ where: { id } }),
      this.prisma.product.findFirstOrThrow({
        where: { id: productId },
      }),
      this.prisma.booking.findMany({
        where: {
          tagId: id,
          slots: {
            some: {
              from: {
                gte: dayjs(date).startOf('day').toDate(),
              },
              to: {
                lte: dayjs(date).endOf('day').toDate(),
              },
            },
          },
        },
      }),
    ]);

    const weekday = dayjs(date).format('dddd');
    const duration = dayjs.duration({
      minutes: product.duration || 15,
    });
    const workdays = tag.workdays;

    // 1. Check if the tag is available on the given weekday.
    if (!workdays.find((w) => w.day === weekday)) {
      return [];
    }

    // Get the workday object for the given weekday.
    const workday = find(workdays, (w) => w.day === weekday);

    const [startHour, startMinute] = workday?.from.split(':');
    const [endHour, endMinute] = workday?.to.split(':');

    // set start time to the given date.
    const startTime = dayjs(date)
      .tz('Asia/Riyadh')
      .set('hour', parseInt(startHour))
      .set('minute', parseInt(startMinute));

    // set end time to the given date.
    const endTime = dayjs(date)
      .tz('Asia/Riyadh')
      .set('hour', parseInt(endHour))
      .set('minute', parseInt(endMinute));

    const availableTimes = [];
    let startFrom = startTime.clone();

    const slots = bookings
      .map((b) =>
        b.slots.map((s) => ({
          from: dayjs(s.from).tz('Asia/Riyadh'),
          to: dayjs(s.to).tz('Asia/Riyadh'),
        }))
      )
      .flat();

    // Split from and to into duration intervals
    while (startFrom.isBefore(endTime)) {
      // Check if the time is available.
      const isAvailable = !slots.some((s) => {
        return (
          startFrom.isBetween(s.from, s.to, 'minute', '()') ||
          startFrom.add(duration).isBetween(s.from, s.to, 'minute', '()')
        );
      });

      if (isAvailable) {
        availableTimes.push({
          from: startFrom.toDate(),
          to: startFrom.add(duration).toDate(),
        });
      }

      startFrom = startFrom.add(duration);
    }

    return availableTimes;
  }
}
