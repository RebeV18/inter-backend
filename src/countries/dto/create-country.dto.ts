import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    description: 'Nombre del país',
    example: 'Chile',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Código ISO del país (2-3 caracteres)',
    example: 'CL',
    minLength: 2,
    maxLength: 3,
  })
  @IsString()
  code: string; // Código ISO del país (ej: "US", "CL", "AR")

  @ApiPropertyOptional({
    description: 'Capital del país',
    example: 'Santiago',
  })
  @IsString()
  @IsOptional()
  capital?: string;

  @ApiPropertyOptional({
    description: 'Región geográfica del país',
    example: 'South America',
    enum: [
      'Africa',
      'Asia',
      'Europe',
      'North America',
      'South America',
      'Oceania',
    ],
  })
  @IsString()
  @IsOptional()
  region?: string; // Ej: "South America", "North America", "Europe"

  @ApiPropertyOptional({
    description: 'Subregión específica',
    example: 'South America',
  })
  @IsString()
  @IsOptional()
  subregion?: string; // Ej: "Western Europe", "Northern America"

  @ApiPropertyOptional({
    description: 'Población del país',
    example: 19116201,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  population?: number;

  @ApiPropertyOptional({
    description: 'Área del país en kilómetros cuadrados',
    example: 756096,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  area?: number; // Área en km²

  @ApiPropertyOptional({
    description: 'Idiomas oficiales del país',
    example: ['Spanish'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsOptional()
  languages?: string[]; // Idiomas hablados

  @ApiPropertyOptional({
    description: 'Monedas oficiales del país',
    example: ['CLP'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsOptional()
  currencies?: string[]; // Monedas

  @ApiPropertyOptional({
    description: 'URL de la imagen de la bandera',
    example: 'https://flagcdn.com/cl.svg',
  })
  @IsString()
  @IsOptional()
  flag?: string; // URL de la bandera

  @ApiPropertyOptional({
    description: 'Zona horaria principal del país',
    example: 'UTC-3',
  })
  @IsString()
  @IsOptional()
  timezone?: string; // Zona horaria principal
}
