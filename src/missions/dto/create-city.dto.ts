import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  order: number;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  place: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  map?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo?: string;
}
