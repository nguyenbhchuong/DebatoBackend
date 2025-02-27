// This file will define the TopicService class
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Topic, TopicDocument } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dto/CreateTopic.dto';
import * as path from 'path';
import * as fs from 'fs';
import { UserInfoService } from '../../user-info/services/user-info.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    private userInfoService: UserInfoService,
  ) {}

  private readonly uploadDirectory = 'uploads/topics';

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadDirectory)) {
      fs.mkdirSync(this.uploadDirectory, { recursive: true });
    }
  }

  private async handleFileUploads(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    if (!files || files.length === 0) return [];

    this.ensureUploadDirectoryExists();
    const filePaths: string[] = [];

    for (const file of files) {
      if (!file.path) continue; // Skip if no path

      filePaths.push(file.path);
    }

    return filePaths;
  }

  async uploadLocalFile(
    file: Express.Multer.File,
    topicId: string,
  ): Promise<string> {
    const [filePath] = await this.handleFileUploads([file]);

    // Update topic with file link
    const topic = await this.topicModel.findById(topicId);
    if (!topic.file_links) {
      topic.file_links = [];
    }
    topic.file_links.push(filePath);
    await topic.save();

    return filePath;
  }

  async create(
    createTopicDto: CreateTopicDto & {
      user_id: Types.ObjectId;
      files?: Express.Multer.File[];
    },
  ): Promise<Topic> {
    const { files, ...topicData } = createTopicDto;

    // Handle file uploads if any
    const filePaths = await this.handleFileUploads(files || []);

    const createdTopic = new this.topicModel({
      ...topicData,
      file_links: filePaths,
    });

    return createdTopic.save();
  }

  async findAll(): Promise<any[]> {
    const topics = await this.topicModel.find().exec();

    // Get user info for all topics
    const topicsWithUserInfo = await Promise.all(
      topics.map(async (topic) => {
        const userInfo = await this.userInfoService.findByUserId(
          topic.user_id.toString(),
        );
        return {
          ...topic.toJSON(),
          user: {
            displayName: userInfo.displayName,
            idName: userInfo.idName,
          },
        };
      }),
    );

    return topicsWithUserInfo;
  }

  async findOne(id: string): Promise<any> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    // Get user info
    const userInfo = await this.userInfoService.findByUserId(
      topic.user_id.toString(),
    );

    // Return topic with user info
    return {
      ...topic.toJSON(),
      user: {
        displayName: userInfo.displayName,
        idName: userInfo.idName,
      },
    };
  }

  async update(id: string, updateTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicModel
      .findByIdAndUpdate(id, { $set: updateTopicDto }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.topicModel.findByIdAndDelete(id).exec();
  }

  async getMedia(fileLink: string): Promise<StreamableFile> {
    try {
      // Ensure the file exists
      if (!fs.existsSync(fileLink)) {
        throw new NotFoundException('File not found');
      }

      const file = fs.createReadStream(fileLink);
      return new StreamableFile(file);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
