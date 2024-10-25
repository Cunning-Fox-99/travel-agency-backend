import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TourService {
  constructor(private prisma: PrismaService) {}

  // Создание нового тура
  async createTour(data: { title: string; description: string; price: number; dates: Date[] }) {
    return this.prisma.tour.create({
      data: {
        ...data,
        dates: JSON.stringify(data.dates), // Сохраняем даты как JSON
      },
    });
  }

  // Получение всех туров
  async getAllTours() {
    return this.prisma.tour.findMany();
  }

  // Получение тура по ID
  async getTourById(id: number) {
    const tour = await this.prisma.tour.findUnique({ where: { id } });
    if (!tour) {
      throw new NotFoundException('Тур не найден');
    }
    return tour;
  }

  // Редактирование тура
  async updateTour(id: number, data: Partial<{ title: string; description: string; price: number; dates: Date[] }>) {
    return this.prisma.tour.update({
      where: { id },
      data: {
        ...data,
        dates: data.dates ? JSON.stringify(data.dates) : undefined, // Обновляем даты только если они переданы
      },
    });
  }

  // Удаление тура
  async deleteTour(id: number) {
    await this.prisma.tour.delete({ where: { id } });
    return { message: 'Тур успешно удалён' };
  }
}
