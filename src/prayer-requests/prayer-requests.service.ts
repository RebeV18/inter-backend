import { Injectable } from '@nestjs/common';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { UpdatePrayerRequestDto } from './dto/update-prayer-request.dto';

@Injectable()
export class PrayerRequestsService {
  create(createPrayerRequestDto: CreatePrayerRequestDto) {
    return createPrayerRequestDto;
  }

  findAll() {
    return `This action returns all prayerRequests`;
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
