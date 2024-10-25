import { Controller, Post, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Бронирование тура (только авторизованные пользователи)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.bookingService.createBooking(userId, createBookingDto);
  }

  // Получение всех броней (для админов)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  // Получение броней текущего пользователя
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserBookings(@Req() req: any) {
    const userId = req.user.userId;
    return this.bookingService.getUserBookings(userId);
  }
}
