import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('debug')
  getEnvValue() {
    console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY); // Логируем для проверки
    return { secret: process.env.JWT_SECRET_KEY };
  }

  // Регистрация пользователя (доступно всем)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // Логин пользователя
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.login(email, password);
  }

  // Создание пользователя админом
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin')
  async createUserByAdmin(
    @Body() createUserDto: CreateUserDto,
    @Body('isAdmin') isAdmin: boolean,
  ) {
    return this.userService.createUserByAdmin(createUserDto, isAdmin);
  }

  // Получение всех пользователей
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Обновление пользователя
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  // Деактивация пользователя
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(+id);
  }
}
