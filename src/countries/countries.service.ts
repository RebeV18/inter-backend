import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class CountriesService {
  private readonly collection = 'countries';

  constructor(private readonly firestoreService: FirestoreService) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country = await this.firestoreService.create(
        this.collection,
        createCountryDto,
      );
      return {
        message: 'Country created successfully',
        data: country,
      };
    } catch (error) {
      throw new Error(`Failed to create country: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const countries = await this.firestoreService.findAll(this.collection);
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
        throw new Error('Country not found');
      }
      return {
        message: 'Country retrieved successfully',
        data: country,
      };
    } catch (error) {
      throw new Error(`Failed to fetch country: ${error.message}`);
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
  async findByRegion(region: string) {
    try {
      const countries = await this.firestoreService.findAll(this.collection, [
        { field: 'region', operator: '==', value: region },
      ]);
      return {
        message: `Countries in ${region} retrieved successfully`,
        data: countries,
        count: countries.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch countries by region: ${error.message}`);
    }
  }
}
