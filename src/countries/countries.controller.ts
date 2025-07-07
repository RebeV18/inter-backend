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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo país' })
  @ApiBody({ type: CreateCountryDto })
  @ApiResponse({
    status: 201,
    description: 'País creado exitosamente',
    schema: {
      example: {
        id: 'abc123',
        custID: 152,
        name: 'Chile',
        continents: ['South America'],
        capital: 'Santiago',
        population: 19116201,
        flags: ['https://flagcdn.com/cl.svg'],
        coat_of_arms: 'https://example.com/chile-coat.png',
        government: 'Presidential Republic',
        hills: 'Andes Mountains',
        geographical_division: '16 regions',
        geopoint: { latitude: -33.4489, longitude: -70.6693 },
        physical_map: 'https://example.com/chile-physical.jpg',
        political_map: 'https://example.com/chile-political.jpg',
        principal_cities: 'Santiago, Valparaíso, Concepción',
        religions: 'Roman Catholicism, Protestantism',
        createdAt: '2025-01-06T10:30:00.000Z',
        updatedAt: '2025-01-06T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los países' })
  @ApiResponse({
    status: 200,
    description: 'Lista de países obtenida exitosamente',
    schema: {
      example: {
        message: 'Countries retrieved successfully',
        data: [
          {
            id: 'abc123',
            custID: 152,
            name: 'Chile',
            continents: ['South America'],
            capital: 'Santiago',
            population: 19116201,
          },
        ],
        count: 1,
      },
    },
  })
  findAll() {
    return this.countriesService.findAll();
  }

  // ✅ MÉTODO MOVIDO DENTRO DE LA CLASE Y ANTES DE :id
  @Get('continent/:continent')
  @ApiOperation({ summary: 'Buscar países por continente' })
  @ApiParam({
    name: 'continent',
    description: 'Nombre del continente',
    example: 'Europe',
  })
  @ApiResponse({
    status: 200,
    description: 'Países por continente obtenidos exitosamente',
    schema: {
      example: {
        message:
          'Countries containing continent "Europe" retrieved successfully',
        data: [
          {
            id: 'france123',
            custID: 250,
            name: 'France',
            continents: ['Europe'],
            capital: 'Paris',
            government: 'Semi-presidential Republic',
          },
        ],
        count: 1,
        searchedContinent: 'Europe',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron países para el continente especificado',
  })
  @ApiResponse({ status: 400, description: 'Continente no proporcionado' })
  findByContinent(@Param('continent') continent: string) {
    return this.countriesService.findByContinent(continent);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un país por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del país',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'País encontrado',
    schema: {
      example: {
        id: 'abc123',
        custID: 152,
        name: 'Chile',
        continents: ['South America'],
        capital: 'Santiago',
        population: 19116201,
        flags: ['https://flagcdn.com/cl.svg'],
        coat_of_arms: 'https://example.com/chile-coat.png',
        government: 'Presidential Republic',
        hills: 'Andes Mountains',
        geographical_division: '16 regions',
        geopoint: { latitude: -33.4489, longitude: -70.6693 },
        physical_map: 'https://example.com/chile-physical.jpg',
        political_map: 'https://example.com/chile-political.jpg',
        principal_cities: 'Santiago, Valparaíso, Concepción',
        religions: 'Roman Catholicism, Protestantism',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'País no encontrado' })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un país existente' })
  @ApiParam({ name: 'id', description: 'ID del país a actualizar' })
  @ApiBody({ type: UpdateCountryDto })
  @ApiResponse({
    status: 200,
    description: 'País actualizado exitosamente',
    schema: {
      example: {
        id: 'abc123',
        custID: 152,
        name: 'Chile Updated',
        continents: ['South America'],
        capital: 'Santiago',
        population: 19500000,
        government: 'Presidential Republic',
        updatedAt: '2025-01-06T11:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'País no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un país' })
  @ApiParam({ name: 'id', description: 'ID del país a eliminar' })
  @ApiResponse({ status: 200, description: 'País eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'País no encontrado' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
