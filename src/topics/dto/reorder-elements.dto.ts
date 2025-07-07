import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderElementsDto {
  @ApiProperty({
    description: 'Array de IDs de elementos en el nuevo orden',
    example: ['elem_123_0', 'elem_123_2', 'elem_123_1'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  elementIds: string[];
}
