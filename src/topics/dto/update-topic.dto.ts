import { PartialType } from '@nestjs/swagger';
import { CreateTopicDto } from './create-topic.dto';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateElementDto } from './update-element.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateElementDto)
  elements?: UpdateElementDto[]; // ✅ Permite IDs opcionales en elementos
}
