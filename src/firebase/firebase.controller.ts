import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirestoreService } from '../firebase/firestore.service';

@ApiTags('firebase')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get('test')
  @ApiOperation({
    summary: 'Probar conexión con Firebase Firestore',
    description:
      'Endpoint para verificar que la conexión con Firebase está funcionando correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Conexión exitosa con Firebase',
    schema: {
      example: {
        success: true,
        message: 'Firebase Firestore connected successfully!',
        timestamp: '2025-01-06T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error de conexión con Firebase',
    schema: {
      example: {
        success: false,
        message: 'Firebase connection failed',
        error: 'Error details',
      },
    },
  })
  async testConnection() {
    try {
      // Intentar crear un documento de prueba
      const testData = {
        message: 'Firebase connection test',
        timestamp: new Date(),
        status: 'connected',
      };

      await this.firestoreService.create('test', testData, 'connection-test');

      return {
        success: true,
        message: 'Firebase Firestore connected successfully!',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Firebase connection failed',
        error: error.message,
      };
    }
  }

  @Get('collections/:collection')
  async getCollection(@Param('collection') collection: string) {
    try {
      const documents = await this.firestoreService.findAll(collection);
      return {
        success: true,
        collection,
        count: documents.length,
        data: documents,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching collection ${collection}`,
        error: error.message,
      };
    }
  }

  @Post('seed/countries')
  async seedCountries() {
    try {
      const sampleCountries = [
        {
          name: 'Chile',
          code: 'CL',
          capital: 'Santiago',
          region: 'South America',
          subregion: 'South America',
          population: 19116201,
          area: 756096,
          languages: ['Spanish'],
          currencies: ['CLP'],
          timezone: 'UTC-3',
        },
        {
          name: 'Argentina',
          code: 'AR',
          capital: 'Buenos Aires',
          region: 'South America',
          subregion: 'South America',
          population: 45195774,
          area: 2780400,
          languages: ['Spanish'],
          currencies: ['ARS'],
          timezone: 'UTC-3',
        },
        {
          name: 'United States',
          code: 'US',
          capital: 'Washington D.C.',
          region: 'North America',
          subregion: 'Northern America',
          population: 331002651,
          area: 9833517,
          languages: ['English'],
          currencies: ['USD'],
          timezone: 'UTC-5',
        },
      ];

      const results: any[] = [];
      for (const country of sampleCountries) {
        const result = await this.firestoreService.create('countries', country);
        results.push(result);
      }

      return {
        success: true,
        message: 'Countries seeded successfully',
        count: results.length,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error seeding countries',
        error: error.message,
      };
    }
  }
}
