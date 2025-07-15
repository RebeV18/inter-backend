import { Module } from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service';
import { PrayerRequestsController } from './prayer-requests.controller';
import { FirestoreService } from '../firebase/firestore.service';

@Module({
  controllers: [PrayerRequestsController],
  providers: [PrayerRequestsService, FirestoreService],
})
export class PrayerRequestsModule {}
