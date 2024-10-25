import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';

@Module({
  providers: [TourService],
  controllers: [TourController]
})
export class TourModule {}
