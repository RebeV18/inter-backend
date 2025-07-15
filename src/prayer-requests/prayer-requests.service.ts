import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { UpdatePrayerRequestDto } from './dto/update-prayer-request.dto';

@Injectable()
export class PrayerRequestsService {
  constructor(private readonly firestoreService: FirestoreService) {}

  create(createPrayerRequestDto: CreatePrayerRequestDto) {
    return createPrayerRequestDto;
  }

  findAll(limit = 20, startAfter?: string) {
    return this.firestoreService.findAll(
      'prayer-requests',
      [],
      limit,
      startAfter,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} prayerRequest`;
  }

  update(id: number, updatePrayerRequestDto: UpdatePrayerRequestDto) {
    console.log(updatePrayerRequestDto);
    return `This action updates a #${id} prayerRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} prayerRequest`;
  }
}
