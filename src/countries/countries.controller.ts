import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
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
        message: 'Country created successfully',
        data: {
          id: 'abc123',
          name: 'Chile',
          code: 'CL',
          capital: 'Santiago',
          region: 'South America',
          population: 19116201,
          createdAt: '2025-01-06T10:30:00.000Z',
          updatedAt: '2025-01-06T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los países o filtrar por región' })
  @ApiQuery({
    name: 'region',
    required: false,
    description: 'Filtrar países por región (ej: South America)',
    example: 'South America',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de países obtenida exitosamente',
    schema: {
      example: {
        message: 'Countries retrieved successfully',
        data: [
          {
            id: 'abc123',
            name: 'Chile',
            code: 'CL',
            capital: 'Santiago',
            region: 'South America',
          },
        ],
        count: 1,
      },
    },
  })
  findAll(@Query('region') region?: string) {
    if (region) {
      return this.countriesService.findByRegion(region);
    }
    return this.countriesService.findAll();
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
        message: 'Country retrieved successfully',
        data: {
          id: 'abc123',
          name: 'Chile',
          code: 'CL',
          capital: 'Santiago',
          region: 'South America',
        },
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
        message: 'Country updated successfully',
        data: {
          id: 'abc123',
          name: 'Chile Updated',
          code: 'CL',
          capital: 'Santiago',
          region: 'South America',
          updatedAt: '2025-01-06T11:30:00.000Z',
        },
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
