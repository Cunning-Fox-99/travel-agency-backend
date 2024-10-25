import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // Импортируем JwtModule

@Module({
  imports: [PrismaModule, JwtModule], // Убедись, что JwtModule добавлен здесь
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
