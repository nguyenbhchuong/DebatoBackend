// This file will define the TopicController class
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { TopicService } from '../services/topic.service';
import { CreateTopicDto } from '../dto/CreateTopic.dto';
import { Topic } from '../schemas/topic.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import * as mime from 'mime-types';
import { CreateReactionDto } from '../dto/reaction.dto';

@ApiTags('Topics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: 'Upload a file for a topic' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File has been successfully uploaded.',
  })
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<{ filePath: string }> {
    const topic = await this.topicService.findOne(id);
    if (topic.user_id.toString() !== req.user.sub) {
      throw new ForbiddenException(
        'You can only upload files to your own topics',
      );
    }
    const filePath = await this.topicService.uploadLocalFile(file, id);
    return { filePath };
  }

  @ApiOperation({ summary: 'Create a new topic' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The topic has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async create(
    @Body() createTopicDto: CreateTopicDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ): Promise<Topic> {
    return this.topicService.create({
      ...createTopicDto,
      user_id: new Types.ObjectId(req.user.sub),
      files,
    });
  }

  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'Return all topics.' })
  @Get()
  async findAll(@Req() req): Promise<Topic[]> {
    return this.topicService.findAll(req.user.sub);
  }

  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({ status: 200, description: 'Return the topic.' })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req): Promise<Topic> {
    return this.topicService.findOne(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Update a topic by ID' })
  @ApiResponse({
    status: 200,
    description: 'The topic has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the topic owner.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: CreateTopicDto,
    @Req() req,
  ): Promise<Topic> {
    const topic = await this.topicService.findOne(id);
    if (topic.user_id.toString() !== req.user.sub) {
      throw new ForbiddenException('You can only update your own topics');
    }
    return this.topicService.update(id, updateTopicDto);
  }

  @ApiOperation({ summary: 'Delete a topic by ID' })
  @ApiResponse({
    status: 204,
    description: 'The topic has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the topic owner.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    const topic = await this.topicService.findOne(id);
    console.log('====================================');
    console.log(topic);
    console.log(req.user.sub);
    console.log('====================================');
    if (topic.user_id.toString() !== req.user.sub) {
      throw new ForbiddenException('You can only delete your own topics');
    }
    return this.topicService.remove(id);
  }

  @Get('media/:filename')
  @ApiOperation({ summary: 'Get media file' })
  @ApiResponse({ status: 200, description: 'Returns the media file' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getMedia(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    // Extract just the filename from any potential path
    const cleanFilename = path.basename(filename.replace(/\\/g, '/'));
    const filePath = path.join('uploads/topics', cleanFilename);

    // Set content type based on file extension, with special handling for jfif
    let contentType = mime.lookup(filePath) || 'application/octet-stream';

    // Handle .jfif files specifically
    if (path.extname(filePath).toLowerCase() === '.jfif') {
      contentType = 'image/jpeg';
    }

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${cleanFilename}"`,
    });

    return this.topicService.getMedia(filePath);
  }

  @Post(':id/reaction')
  @ApiOperation({ summary: 'Add/update/remove reaction to a topic' })
  @ApiResponse({ status: 200, description: 'Reaction processed successfully' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async addReaction(
    @Param('id') id: string,
    @Body() reactionDto: CreateReactionDto,
    @Req() req,
  ): Promise<void> {
    return this.topicService.addReaction(id, req.user.sub, reactionDto.type);
  }
}
