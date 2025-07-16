import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { FirestoreService } from '../firebase/firestore.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission, City } from '../types/interfaces';

@Injectable()
export class MissionsService {
  private readonly collection = 'missions';

  constructor(private readonly firestoreService: FirestoreService) {}

  async createMission(createMissionDto: CreateMissionDto): Promise<Mission> {
    const missionId = uuidv4().substring(0, 8);
    const cities = createMissionDto.cities.map((city, index) => ({
      order: `elem_${missionId}_${index}`,
      country: city.place,
      map: city.map || '',
      photo: city.photo || '',
    }));

    const createdMission = await this.firestoreService.create(
      this.collection,
      cities,
    );

    return createdMission as Mission;
  }

  async findAll(limit = 20, startAfter?: string): Promise<Mission[]> {
    const missions = await this.firestoreService.findAll(
      this.collection,
      [],
      limit,
      startAfter,
    );
    return missions as Mission[];
  }

  async findOne(order: string): Promise<Mission> {
    const mission = await this.firestoreService.findOne(this.collection, order);

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${order} not found`);
    }

    return mission as Mission;
  }

  async update(
    order: string,
    updateMissionDto: UpdateMissionDto,
  ): Promise<Mission> {
    const updateData: any = {};

    if (updateMissionDto.country) {
      updateData.country = updateMissionDto.country;
    }

    if (updateMissionDto.cities) {
      updateData.cities = updateMissionDto.cities.map((city, index) => ({
        order: city.order || `elem_${Date.now()}_${index}`,
        country: city.place,
        map: city.map || '',
      }));
    }

    const result = await this.firestoreService.update(
      this.collection,
      order,
      updateData,
    );

    return result as Mission;
  }

  async remove(order: string): Promise<{ order: string; deleted: boolean }> {
    const result = await this.firestoreService.remove(this.collection, order);
    // Aseguramos que la propiedad sea 'order' y no 'id'
    return { order, deleted: result.deleted };
  }

  // ===== MÉTODOS PARA MANEJAR ELEMENTOS EMBEBIDOS =====

  async addCityToMission(missionId: string, city: any): Promise<City> {
    const mission = await this.firestoreService.findOne(
      this.collection,
      missionId,
    );

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    const currentCities = (mission as any).cities || [];
    const newCity: City = {
      order: city.order,
      place: city.place,
      map: city.map || '',
      photo: city.photo || '',
    };

    const updatedCities = [...currentCities, newCity];
    await this.firestoreService.update(this.collection, missionId, {
      cities: updatedCities,
    });

    return newCity;
  }

  async updateCityInMission(
    missionId: string,
    cityId: string,
    updateData: any,
  ): Promise<City> {
    const mission = await this.firestoreService.findOne(
      this.collection,
      missionId,
    );

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    const cities = (mission as any).cities || [];
    const cityIndex = cities.findIndex(
      (el: City) => String(el.order) === String(cityId),
    );

    if (cityIndex === -1) {
      throw new NotFoundException(
        `City with ID ${cityId} not found in mission`,
      );
    }

    cities[cityIndex] = {
      ...cities[cityIndex],
      ...updateData,
    };

    await this.firestoreService.update(this.collection, missionId, {
      cities,
    });

    return cities[cityIndex];
  }

  async removeCityFromMission(
    missionId: string,
    cityId: string,
  ): Promise<{ message: string }> {
    const mission = await this.firestoreService.findOne(
      this.collection,
      missionId,
    );

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    const cities = (mission as any).cities || [];
    const filteredCities = cities.filter(
      (el: City) => String(el.order) !== String(cityId),
    );

    if (cities.length === filteredCities.length) {
      throw new NotFoundException(
        `City with ID ${cityId} not found in mission`,
      );
    }

    // Mantener el identificador único 'order' de cada ciudad, solo reordenar el array
    const reorderedCities = filteredCities;

    await this.firestoreService.update(this.collection, missionId, {
      cities: reorderedCities,
      totalCities: reorderedCities.length,
    });

    return { message: `City ${cityId} removed successfully` };
  }

  async reorderCities(missionId: string, cityIds: string[]): Promise<City[]> {
    const mission = await this.firestoreService.findOne(
      this.collection,
      missionId,
    );

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    const cities = (mission as any).cities || [];

    // Validar que todos los IDs existen
    for (const id of cityIds) {
      const exists = cities.some((el: City) => String(el.order) === String(id));
      if (!exists) {
        throw new NotFoundException(`City with ID ${id} not found`);
      }
    }

    if (cityIds.length !== cities.length) {
      throw new BadRequestException(
        `Must proveer all city IDs. Expected ${cities.length}, got ${cityIds.length}`,
      );
    }

    // Reordenar el array de ciudades según el orden de cityIds
    const reorderedCities = cityIds.map((id) => {
      const city = cities.find((el: City) => String(el.order) === String(id));
      return {
        ...city!,
      };
    });
    await this.firestoreService.update(this.collection, missionId, {
      cities: reorderedCities,
    });

    return reorderedCities;
  }

  async getCityFromMission(missionId: string, cityId: string): Promise<City> {
    const mission = await this.firestoreService.findOne(
      this.collection,
      missionId,
    );

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    const cities = (mission as any).cities || [];
    const city = cities.find((el: City) => String(el.order) === String(cityId));

    if (!city) {
      throw new NotFoundException(
        `City with ID ${cityId} not found in mission`,
      );
    }

    return city;
  }

  async getCitiesFromMission(missionId: string): Promise<{
    missionId: string;
    missionTheme: string;
    cities: City[];
  }> {
    const mission = await this.firestoreService.findOne(
      this.collection,
      missionId,
    );

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${missionId} not found`);
    }

    return {
      missionId,
      missionTheme: (mission as any).country,
      cities: (mission as any).cities || [],
    };
  }
}
