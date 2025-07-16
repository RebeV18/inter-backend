import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderCitiesDto {
  @ApiProperty({
    description: 'Array de IDs de cities en el nuevo orden',
    example: ['elem_123_0', 'elem_123_2', 'elem_123_1'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  citiesOrder: string[];
}
