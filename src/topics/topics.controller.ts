import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateElementDto } from './dto/create-element.dto';
import { ReorderElementsDto } from './dto/reorder-elements.dto';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo topic' })
  @ApiResponse({ status: 201, description: 'Topic creado exitosamente' })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.createTopic(createTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los topics' })
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un topic por ID' })
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un topic' })
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un topic' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }

  // ===== ENDPOINTS PARA ELEMENTOS =====

  @Post(':id/elements')
  @ApiOperation({ summary: 'Agregar elemento a un topic' })
  addElement(
    @Param('id') topicId: string,
    @Body() createElementDto: CreateElementDto,
  ) {
    return this.topicsService.addElementToTopic(topicId, createElementDto);
  }

  @Patch(':topicId/elements/:elementId')
  @ApiOperation({ summary: 'Actualizar elemento en un topic' })
  updateElement(
    @Param('topicId') topicId: string,
    @Param('elementId') elementId: string,
    @Body() updateData: Partial<CreateElementDto>,
  ) {
    return this.topicsService.updateElementInTopic(
      topicId,
      elementId,
      updateData,
    );
  }

  @Delete(':topicId/elements/:elementId')
  @ApiOperation({ summary: 'Eliminar elemento de un topic' })
  removeElement(
    @Param('topicId') topicId: string,
    @Param('elementId') elementId: string,
  ) {
    return this.topicsService.removeElementFromTopic(topicId, elementId);
  }

  @Patch(':id/elements/reorder')
  @ApiOperation({ summary: 'Reordenar elementos en un topic' })
  @ApiResponse({
    status: 200,
    description: 'Elementos reordenados exitosamente',
  })
  reorderElements(
    @Param('id') topicId: string,
    @Body() reorderDto: ReorderElementsDto, // ✅ Usar DTO específico
  ) {
    return this.topicsService.reorderElements(topicId, reorderDto.elementIds);
  }
}
