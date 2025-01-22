// This file will define the TopicController class
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TopicService } from '../services/topic.service';
import { CreateTopicDto } from '../dto/CreateTopic.dto';
import { Topic } from '../schemas/topic.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('topics')
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({
    status: 201,
    description: 'The topic has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicService.create(createTopicDto);
  }

  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'Return all topics.' })
  @Get()
  async findAll(): Promise<Topic[]> {
    return this.topicService.findAll();
  }

  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({ status: 200, description: 'Return the topic.' })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Topic> {
    return this.topicService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a topic by ID' })
  @ApiResponse({
    status: 200,
    description: 'The topic has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: CreateTopicDto,
  ): Promise<Topic> {
    return this.topicService.update(id, updateTopicDto);
  }

  @ApiOperation({ summary: 'Delete a topic by ID' })
  @ApiResponse({
    status: 204,
    description: 'The topic has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.topicService.remove(id);
  }
}
