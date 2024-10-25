import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание брони
  async createBooking(userId: number, createBookingDto: CreateBookingDto) {
    const { tourId } = createBookingDto;

    // Проверим, что тур существует
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      throw new NotFoundException('Тур не найден');
    }

    // Создаём бронь, используя `connect`
    return this.prisma.booking.create({
      data: {
        user: { connect: { id: userId } },
        tour: { connect: { id: tourId } },
      },
    });
  }

  // Получение всех броней для администратора
  async getAllBookings() {
    return this.prisma.booking.findMany({
      include: { user: true, tour: true }, // Подгружаем данные пользователя и тура
    });
  }

  // Получение всех броней конкретного пользователя
  async getUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { tour: true },
    });
  }
}
