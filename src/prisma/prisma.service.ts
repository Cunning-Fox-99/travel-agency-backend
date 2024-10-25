import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Подключаемся к базе при инициализации модуля
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Закрываем соединение при завершении работы
  }
}
