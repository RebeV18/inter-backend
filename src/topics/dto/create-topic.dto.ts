import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateElementDto } from './create-element.dto';

export class CreateTopicDto {
  @ApiProperty({
    description: 'Tema principal del tópico',
    example: 'Elecciones Presidenciales 2025',
  })
  @IsString()
  @MinLength(1)
  theme: string;

  @ApiProperty({
    description: 'Lista de elementos relacionados',
    example: ['Naciones', 'Fechas', 'Subtemas'],
    type: [CreateElementDto],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayNotEmpty()
  @IsString({ each: true }) // Valida que cada elemento del array sea string
  elements: CreateElementDto[];
}
