import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './models/reviews.model';
import { ReviewsService } from './reviews.service';

@Resolver(() => String)
export class ReviewsResolver {
  constructor(
    private readonly reviewService: ReviewsService,
    private readonly prisma: PrismaService
  ) {}

  @Query(() => [Review])
  getReviews(): Promise<Review[]> {
    return this.reviewService.getReviews();
  }

  @Mutation(() => Review)
  deleteReview(@Args('id') id: string): Promise<Review> {
    return this.reviewService.deleteReview(id);
  }

  @Mutation(() => Review)
  addReview(@Args('data') data: CreateReviewInput): Promise<Review> {
    return this.reviewService.addReview(data);
  }

  @Mutation(() => Review)
  updateReview(
    @Args('id') id: string,
    @Args('data') data: UpdateReviewInput
  ): Promise<Review> {
    return this.reviewService.updateReview(id, data);
  }
}
