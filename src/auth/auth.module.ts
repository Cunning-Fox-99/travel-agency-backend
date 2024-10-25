import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule, // Для работы с аутентификацией
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET_KEY');
        console.log('JWT_SECRET_KEY:', secret); // Логируем для проверки
        return {
          secret,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  providers: [JwtStrategy], // Подключаем стратегию JWT
  exports: [JwtModule], // Экспортируем для использования в других модулях
})
export class AuthModule {}
