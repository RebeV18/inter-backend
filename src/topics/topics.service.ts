import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { FirestoreService } from '../firebase/firestore.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic, TopicElement } from '../types/interfaces';

@Injectable()
export class TopicsService {
  private readonly collection = 'topics';

  constructor(private readonly firestoreService: FirestoreService) {}

  async createTopic(createTopicDto: CreateTopicDto): Promise<Topic> {
    const topicId = uuidv4().substring(0, 8);
    const elements = createTopicDto.elements.map((element, index) => ({
      id: `elem_${topicId}_${index}`,
      text: element.text,
      pic: element.pic || '',
    }));

    const createdTopic = await this.firestoreService.create(
      this.collection,
      elements,
    );

    return createdTopic as Topic;
  }

  async findAll(limit = 20, startAfter?: string): Promise<Topic[]> {
    const topics = await this.firestoreService.findAll(
      this.collection,
      [],
      limit,
      startAfter,
    );
    return topics as Topic[];
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.firestoreService.findOne(this.collection, id);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }

    return topic as Topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const updateData: any = {};

    if (updateTopicDto.theme) {
      updateData.theme = updateTopicDto.theme;
    }

    if (updateTopicDto.elements) {
      updateData.elements = updateTopicDto.elements.map((element, index) => ({
        id: element.id || `elem_${Date.now()}_${index}`,
        text: element.text,
        pic: element.pic || '',
      }));
    }

    const result = await this.firestoreService.update(
      this.collection,
      id,
      updateData,
    );

    return result as Topic;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    return await this.firestoreService.remove(this.collection, id);
  }

  // ===== MÉTODOS PARA MANEJAR ELEMENTOS EMBEBIDOS =====

  async addElementToTopic(
    topicId: string,
    element: any,
  ): Promise<TopicElement> {
    const topic = await this.firestoreService.findOne(this.collection, topicId);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    const currentElements = (topic as any).elements || [];
    const newElement: TopicElement = {
      id: `elem_${Date.now()}`,
      text: element.text,
      pic: element.pic || '',
    };

    const updatedElements = [...currentElements, newElement];
    await this.firestoreService.update(this.collection, topicId, {
      elements: updatedElements,
    });

    return newElement;
  }

  async updateElementInTopic(
    topicId: string,
    elementId: string,
    updateData: any,
  ): Promise<TopicElement> {
    const topic = await this.firestoreService.findOne(this.collection, topicId);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    const elements = (topic as any).elements || [];
    const elementIndex = elements.findIndex(
      (el: TopicElement) => el.id === elementId,
    );

    if (elementIndex === -1) {
      throw new NotFoundException(
        `Element with ID ${elementId} not found in topic`,
      );
    }

    elements[elementIndex] = {
      ...elements[elementIndex],
      ...updateData,
    };

    await this.firestoreService.update(this.collection, topicId, {
      elements,
    });

    return elements[elementIndex];
  }

  async removeElementFromTopic(
    topicId: string,
    elementId: string,
  ): Promise<{ message: string }> {
    const topic = await this.firestoreService.findOne(this.collection, topicId);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    const elements = (topic as any).elements || [];
    const filteredElements = elements.filter(
      (el: TopicElement) => el.id !== elementId,
    );

    if (elements.length === filteredElements.length) {
      throw new NotFoundException(
        `Element with ID ${elementId} not found in topic`,
      );
    }

    const reorderedElements = filteredElements.map(
      (el: TopicElement, index: number) => ({
        ...el,
        order: index,
      }),
    );

    await this.firestoreService.update(this.collection, topicId, {
      elements: reorderedElements,
      totalElements: reorderedElements.length,
    });

    return { message: `Element ${elementId} removed successfully` };
  }

  async reorderElements(
    topicId: string,
    elementIds: string[],
  ): Promise<TopicElement[]> {
    const topic = await this.firestoreService.findOne(this.collection, topicId);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    const elements = (topic as any).elements || [];

    // Validar que todos los IDs existen
    for (const id of elementIds) {
      const exists = elements.some((el: TopicElement) => el.id === id);
      if (!exists) {
        throw new NotFoundException(`Element with ID ${id} not found`);
      }
    }

    if (elementIds.length !== elements.length) {
      throw new BadRequestException(
        `Must provide all element IDs. Expected ${elements.length}, got ${elementIds.length}`,
      );
    }

    const reorderedElements = elementIds.map((id) => {
      const element = elements.find((el: TopicElement) => el.id === id);
      return {
        ...element!,
      };
    });
    await this.firestoreService.update(this.collection, topicId, {
      elements: reorderedElements,
    });

    return reorderedElements;
  }

  async getElementFromTopic(
    topicId: string,
    elementId: string,
  ): Promise<TopicElement> {
    const topic = await this.firestoreService.findOne(this.collection, topicId);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    const elements = (topic as any).elements || [];
    const element = elements.find((el: TopicElement) => el.id === elementId);

    if (!element) {
      throw new NotFoundException(
        `Element with ID ${elementId} not found in topic`,
      );
    }

    return element;
  }

  async getElementsFromTopic(topicId: string): Promise<{
    topicId: string;
    topicTheme: string;
    elements: TopicElement[];
  }> {
    const topic = await this.firestoreService.findOne(this.collection, topicId);

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    return {
      topicId,
      topicTheme: (topic as any).theme,
      elements: (topic as any).elements || [],
    };
  }
}
