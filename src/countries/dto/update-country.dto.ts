import { PartialType } from '@nestjs/swagger';
import { CreateCountryDto } from './create-country.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsUrl,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiProperty({
    description: 'ID personalizado del país',
    example: 152,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  custID?: number;

  @ApiProperty({
    description: 'Nombre del país',
    example: 'Chile',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Continentes del país',
    type: [String],
    example: ['South America'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  continents?: string[];

  @ApiProperty({
    description: 'Capital del país',
    required: false,
    example: 'Santiago',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  capital?: string;

  @ApiProperty({
    description: 'Población del país',
    required: false,
    example: 19116201,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  population?: number;

  @ApiProperty({
    description: 'URLs de las banderas del país',
    type: [String],
    required: false,
    example: ['https://flagcdn.com/cl.svg'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  flags?: string[];

  @ApiProperty({
    description: 'URL del escudo de armas',
    required: false,
    example: 'https://example.com/chile-coat.png',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  coat_of_arms?: string;

  @ApiProperty({
    description: 'Tipo de gobierno',
    required: false,
    example: 'Presidential Republic',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  government?: string;

  @ApiProperty({
    description: 'Descripción de colinas/relieve',
    required: false,
    example: 'Andes Mountains, Coastal Range',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  hills?: string;

  @ApiProperty({
    description: 'División geográfica administrativa',
    required: false,
    example: '16 regions, 56 provinces, 346 communes',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  geographical_division?: string;

  @ApiProperty({
    description: 'Latitud del país (-90 a 90)',
    minimum: -90,
    maximum: 90,
    example: -33.4489,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({
    description: 'Longitud del país (-180 a 180)',
    minimum: -180,
    maximum: 180,
    example: -70.6693,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({
    description: 'URL del mapa físico',
    required: false,
    example: 'https://example.com/chile-physical-map.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  physical_map?: string;

  @ApiProperty({
    description: 'URL del mapa político',
    required: false,
    example: 'https://example.com/chile-political-map.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  political_map?: string;

  @ApiProperty({
    description: 'Principales ciudades del país',
    required: false,
    example: 'Santiago, Valparaíso, Concepción, La Serena, Antofagasta',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  principal_cities?: string;

  @ApiProperty({
    description: 'Principales religiones del país',
    required: false,
    example: 'Roman Catholicism (66%), Protestantism (16%), No religion (12%)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  religions?: string;
}
