import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание отзыва (пользователь должен иметь бронирование этого тура)
  async createReview(userId: number, tourId: number, content: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { userId, tourId },
    });

    if (!booking) {
      throw new ForbiddenException('Вы можете оставить отзыв только на забронированный тур.');
    }

    return this.prisma.review.create({
      data: {
        content,
        user: { connect: { id: userId } },
        tour: { connect: { id: tourId } },
      },
    });
  }

  // Получение всех отзывов для тура
  async getReviewsForTour(tourId: number) {
    return this.prisma.review.findMany({
      where: { tourId },
      include: { user: true },
    });
  }

  // Редактирование отзыва (только автор отзыва)
  async updateReview(userId: number, reviewId: number, content: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== userId) {
      throw new ForbiddenException('Вы можете редактировать только свои отзывы.');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { content },
    });
  }

  // Удаление отзыва (только автор или администратор)
  async deleteReview(userId: number, reviewId: number, isAdmin: boolean) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('Отзыв не найден.');
    }

    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Вы можете удалить только свои отзывы.');
    }

    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}
