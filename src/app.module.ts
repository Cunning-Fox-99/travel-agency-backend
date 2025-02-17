import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TourModule } from './tour/tour.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делаем доступным во всех модулях
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    TourModule,
    BookingModule,
    ReviewModule,
  ],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}
