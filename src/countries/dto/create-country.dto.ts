import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class GeopointDto {
  @ApiProperty({ example: -33.4489 })
  @IsNumber()
  latitude: number;
  @ApiProperty({ example: -70.6693 })
  @IsNumber()
  longitude: number;
}

export class CreateCountryDto {
  @ApiProperty({ example: 'abc123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Chile' })
  @IsString()
  name: string;

  @ApiProperty({ type: [String], example: ['South America'] })
  @IsArray()
  @IsString({ each: true })
  continents: string[];

  @ApiProperty({ type: [String], example: ['https://flagcdn.com/cl.svg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  flags: string[];

  @ApiProperty({
    example: 'https://example.com/chile-coat.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  coat_of_arms?: string;

  @ApiProperty({ example: 'Santiago' })
  @IsString()
  capital: string;

  @ApiProperty({ type: GeopointDto })
  @ValidateNested()
  @Type(() => GeopointDto)
  geopoint: GeopointDto;

  @ApiProperty({ example: '16 regions' })
  @IsString()
  geographical_division: string;

  @ApiProperty({
    example: 'https://example.com/chile-physical.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  physical_map?: string;

  @ApiProperty({
    example: 'https://example.com/chile-political.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  political_map?: string;

  @ApiProperty({ example: 'Presidential Republic', required: false })
  @IsOptional()
  @IsString()
  government?: string;

  @ApiProperty({ example: 7561024, required: false })
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiProperty({ example: 'Santiago, Valparaíso, Concepción', required: false })
  @IsOptional()
  @IsString()
  principal_cities?: string;

  @ApiProperty({ example: 'Andes Mountains', required: false })
  @IsOptional()
  @IsString()
  hills?: string;

  @ApiProperty({ example: 'Villarrica, Osorno', required: false })
  @IsOptional()
  @IsString()
  volcanoes?: string;

  @ApiProperty({
    example: 'Aeropuerto Internacional Arturo Merino Benítez',
    required: false,
  })
  @IsOptional()
  @IsString()
  doors?: string;

  @ApiProperty({ example: 'Colchane', required: false })
  @IsOptional()
  @IsString()
  dangerous_places?: string;

  @ApiProperty({ example: 19116201, required: false })
  @IsOptional()
  @IsNumber()
  population?: number;

  @ApiProperty({ example: 'Roman Catholicism, Protestantism', required: false })
  @IsOptional()
  @IsString()
  religions?: string;
}
