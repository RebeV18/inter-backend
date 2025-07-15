import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { UpdatePrayerRequestDto } from './dto/update-prayer-request.dto';

@Controller('prayer-requests')
export class PrayerRequestsController {
  constructor(private readonly prayerRequestsService: PrayerRequestsService) {}

  @Post()
  create(@Body() createPrayerRequestDto: CreatePrayerRequestDto) {
    return this.prayerRequestsService.create(createPrayerRequestDto);
  }

  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('startAfter') startAfter?: string,
  ) {
    return this.prayerRequestsService.findAll(
      limit ? Number(limit) : 20,
      startAfter,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prayerRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrayerRequestDto: UpdatePrayerRequestDto,
  ) {
    return this.prayerRequestsService.update(+id, updatePrayerRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prayerRequestsService.remove(+id);
  }
}
