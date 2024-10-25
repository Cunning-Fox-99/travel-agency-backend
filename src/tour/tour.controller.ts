import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { TourService } from './tour.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // Создание тура (доступно только админам)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createTour(@Body() data: { title: string; description: string; price: number; dates: Date[] }) {
    return this.tourService.createTour(data);
  }

  // Получение всех туров
  @Get()
  async getAllTours() {
    return this.tourService.getAllTours();
  }

  // Получение тура по ID
  @Get(':id')
  async getTourById(@Param('id') id: string) {
    return this.tourService.getTourById(+id); // Преобразуем id в число
  }

  // Редактирование тура (доступно только админам)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateTour(@Param('id') id: string, @Body() data: Partial<{ title: string; description: string; price: number; dates: Date[] }>) {
    return this.tourService.updateTour(+id, data);
  }

  // Удаление тура (доступно только админам)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteTour(@Param('id') id: string) {
    return this.tourService.deleteTour(+id);
  }
}
