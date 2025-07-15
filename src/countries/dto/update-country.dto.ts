import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';
import { CreateCountryDto } from './create-country.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiProperty({
    type: [String],
    example: ['Andes Mountains'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hills?: string[];

  @ApiProperty({
    type: [String],
    example: ['Villarrica', 'Osorno'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  volcanoes?: string[];

  @ApiProperty({
    type: [String],
    example: ['Aeropuerto Internacional Arturo Merino Benítez'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  doors?: string[];

  @ApiProperty({
    type: [String],
    example: ['Colchane'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dangerous_places?: string[];
}
