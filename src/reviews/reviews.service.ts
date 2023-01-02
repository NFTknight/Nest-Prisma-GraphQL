import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './models/reviews.model';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReviews(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }

  async addReview(data: CreateReviewInput): Promise<Review> {
    return this.prisma.review.create({ data });
  }

  async deleteReview(id: string): Promise<Review> {
    return this.prisma.review.delete({ where: { id } });
  }

  async updateReview(id: string, data: UpdateReviewInput): Promise<Review> {
    return this.prisma.review.update({ where: { id }, data });
  }

  async getReviewsByProductId(id: string): Promise<Review[]> {
    return this.prisma.review.findMany({ where: { productId: id } });
  }
}
