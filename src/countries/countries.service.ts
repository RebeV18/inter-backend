import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FirestoreService } from '../firebase/firestore.service';

import { Country } from '../types/interfaces';

@Injectable()
export class CountriesService {
  private readonly collection = 'countries';

  constructor(private readonly firestoreService: FirestoreService) {}

  async create(
    createCountryDto: CreateCountryDto,
  ): Promise<{ message: string; data: Country }> {
    try {
      const { id, ...data } = createCountryDto;
      const countryDoc = await this.firestoreService.createWithId(
        this.collection,
        String(id),
        data,
      );
      return {
        message: 'Country created successfully',
        data: countryDoc,
      };
    } catch (error) {
      throw new Error(`Failed to create country: ${error.message}`);
    }
  }

  async findAll(limit = 20, startAfter?: string) {
    try {
      const countries = await this.firestoreService.findAll(
        this.collection,
        [],
        limit,
        startAfter,
      );
      return {
        message: 'Countries retrieved successfully',
        data: countries,
        count: countries.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const country = await this.firestoreService.findOne(this.collection, id);
      if (!country) {
        throw new NotFoundException('Country not found');
      }
      return {
        message: 'Country retrieved successfully',
        data: country,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch country: ${error.message}`,
      );
    }
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    try {
      const updatedCountry = await this.firestoreService.update(
        this.collection,
        id,
        updateCountryDto,
      );
      return {
        message: 'Country updated successfully',
        data: updatedCountry,
      };
    } catch (error) {
      throw new Error(`Failed to update country: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.firestoreService.remove(this.collection, id);
      return {
        message: 'Country deleted successfully',
        data: result,
      };
    } catch (error) {
      throw new Error(`Failed to delete country: ${error.message}`);
    }
  }

  // Método adicional para buscar países por región
  async findByContinent(continent: string) {
    try {
      // Validar que se proporcione el continente
      if (!continent) {
        throw new Error('Please provide the continent name');
      }

      // ✅ Usar 'array-contains' para buscar en arrays
      const countries = await this.firestoreService.findAll(this.collection, [
        { field: 'continents', operator: 'array-contains', value: continent },
      ]);

      return {
        message: `Countries containing continent "${continent}" retrieved successfully`,
        data: countries,
        count: countries.length,
        searchedContinent: continent,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch countries by continent: ${error.message}`,
      );
    }
  }
}
