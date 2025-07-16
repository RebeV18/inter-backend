import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { ReorderCitiesDto } from './dto/reorder-cities.dto';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva misión' })
  @ApiResponse({ status: 201, description: 'Misión creada exitosamente' })
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.createMission(createMissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las misiones' })
  findAll(
    @Query('limit') limit?: number,
    @Query('startAfter') startAfter?: string,
  ) {
    return this.missionsService.findAll(limit ? Number(limit) : 20, startAfter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una misión por ID' })
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una misión' })
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto) {
    return this.missionsService.update(id, updateMissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una misión' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.missionsService.remove(id);
  }

  // ===== ENDPOINTS PARA ELEMENTOS =====

  @Post(':id/cities')
  @ApiOperation({ summary: 'Agregar ciudad a una misión' })
  addCity(
    @Param('id') missionId: string,
    @Body() createCityDto: CreateCityDto,
  ) {
    return this.missionsService.addCityToMission(missionId, createCityDto);
  }

  @Patch(':missionId/cities/:cityId')
  @ApiOperation({ summary: 'Actualizar ciudad en una misión' })
  updateCity(
    @Param('missionId') missionId: string,
    @Param('cityId') cityId: string,
    @Body() updateData: Partial<CreateCityDto>,
  ) {
    return this.missionsService.updateCityInMission(
      missionId,
      cityId,
      updateData,
    );
  }

  @Delete(':missionId/cities/:cityId')
  @ApiOperation({ summary: 'Eliminar ciudad de una misión' })
  removeCity(
    @Param('missionId') missionId: string,
    @Param('cityId') cityId: string,
  ) {
    return this.missionsService.removeCityFromMission(missionId, cityId);
  }

  @Patch(':id/cities/reorder')
  @ApiOperation({ summary: 'Reordenar ciudades en una misión' })
  @ApiResponse({
    status: 200,
    description: 'Ciudades reordenadas exitosamente',
  })
  reorderCities(
    @Param('id') missionId: string,
    @Body() reorderDto: ReorderCitiesDto, // ✅ Usar DTO específico
  ) {
    return this.missionsService.reorderCities(
      missionId,
      reorderDto.citiesOrder,
    );
  }
}
