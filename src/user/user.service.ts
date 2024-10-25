import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // Регистрация обычного пользователя
  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return this.prisma.user.create({
        data: { email, password: hashedPassword },
      });
    } catch (error) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }
  }

  // Логин и JWT токен
  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Неверный email или пароль');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Ваш аккаунт деактивирован.');
    }

    const payload = { sub: user.id, isAdmin: user.isAdmin };
    const jwtSecret = this.configService.get<string>('JWT_SECRET_KEY'); // Получаем секрет из .env

    const token = this.jwtService.sign(payload, { secret: jwtSecret });

    return { access_token: token };
  }

  // Создание пользователя админом (включая других админов)
  async createUserByAdmin(createUserDto: CreateUserDto, isAdmin: boolean) {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { email, password: hashedPassword, isAdmin },
    });
  }

  // Обновление пользователя (пароль или статус)
  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const { password, isAdmin } = updateUserDto;
    const data: any = {};

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    if (isAdmin !== undefined) {
      data.isAdmin = isAdmin;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // Деактивация пользователя
  async deactivateUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false }, // Убедись, что поле корректно распознаётся
    });
  }


  // Получение всех пользователей (для админа)
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, isAdmin: true, isActive: true },
    });
  }
}
