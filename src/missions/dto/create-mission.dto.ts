import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCityDto } from './create-city.dto';

export class CreateMissionDto {
  @ApiProperty({
    description: 'País de la misión',
    example: 'Chile',
  })
  @IsString()
  @MinLength(1)
  country: string;

  @ApiProperty({
    description: 'Lista de ciudades o lugares relacionados',
    example: ['Santiago', 'San Fernando', 'Ancud'],
    type: [CreateCityDto],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayNotEmpty()
  @IsString({ each: true }) // Valida que cada elemento del array sea string
  cities: CreateCityDto[];

  @ApiProperty({
    description: 'Mapa de la ciudad o post',
    example: 'Mapa de Santiago.',
  })
  @IsString()
  @MinLength(1)
  map: string;

  @ApiProperty({
    description: 'Foto de la ciudad o lugar',
    example: 'Foto de Estadio.',
  })
  @IsString()
  @MinLength(1)
  photo: string;
}
