import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':tourId')
  async createReview(
    @Param('tourId') tourId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.reviewService.createReview(userId, +tourId, content);
  }

  @Get(':tourId')
  async getReviewsForTour(@Param('tourId') tourId: string) {
    return this.reviewService.getReviewsForTour(+tourId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':reviewId')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.reviewService.updateReview(userId, +reviewId, content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') reviewId: string, @Req() req: any) {
    const { userId, isAdmin } = req.user;
    return this.reviewService.deleteReview(userId, +reviewId, isAdmin);
  }
}
