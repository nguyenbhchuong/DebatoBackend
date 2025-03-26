// This file will define the TopicService class
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Topic, TopicDocument } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dto/CreateTopic.dto';
import * as path from 'path';
import * as fs from 'fs';
import { UserInfoService } from '../../user-info/services/user-info.service';
import { Reaction, ReactionDocument } from '../schemas/reaction.schema';
import { PubSubService } from '../../shared/services/pub-sub.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    private userInfoService: UserInfoService,
    private readonly pubSubService: PubSubService,
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

    const savedTopic = await createdTopic.save();

    // Publish message to Pub/Sub after successful creation
    await this.pubSubService.publish('tag-new-topic', null, {
      post_id: savedTopic._id.toString(),
    });

    return savedTopic;
  }

  async findAll(userId?: string): Promise<any[]> {
    const topics = await this.topicModel.find().exec();

    const topicsWithInfo = await Promise.all(
      topics.map(async (topic) => {
        const userInfo = await this.userInfoService.findByUserId(
          topic.user_id.toString(),
        );

        const userReaction = userId
          ? await this.getUserReaction(topic._id.toString(), userId)
          : null;

        return {
          ...topic.toJSON(),
          user: {
            displayName: userInfo.displayName,
            idName: userInfo.idName,
          },
          userReaction,
        };
      }),
    );

    return topicsWithInfo;
  }

  async findOne(id: string, userId?: string): Promise<any> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const userInfo = await this.userInfoService.findByUserId(
      topic.user_id.toString(),
    );

    const userReaction = userId ? await this.getUserReaction(id, userId) : null;

    return {
      ...topic.toJSON(),
      user: {
        displayName: userInfo.displayName,
        idName: userInfo.idName,
      },
      userReaction,
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

  async addReaction(
    topicId: string,
    userId: string,
    type: number,
  ): Promise<void> {
    const session = await this.reactionModel.startSession();
    session.startTransaction();

    try {
      // Find existing reaction
      const existingReaction = await this.reactionModel.findOne({
        topic_id: new Types.ObjectId(topicId),
        user_id: new Types.ObjectId(userId),
      });

      if (existingReaction) {
        if (type === 0) {
          // Remove reaction if same type (toggle off)
          await this.reactionModel.deleteOne({
            _id: existingReaction._id,
          });

          // Update counts
          if (existingReaction.type === 1) {
            await this.topicModel.updateOne(
              { _id: new Types.ObjectId(topicId) },
              { $inc: { support_count: -1 } },
            );
          } else {
            await this.topicModel.updateOne(
              { _id: new Types.ObjectId(topicId) },
              { $inc: { oppose_count: -1 } },
            );
          }
        } else {
          // Update reaction type if different
          await this.reactionModel.updateOne(
            { _id: existingReaction._id },
            { type },
          );

          // Update counts
          if (type === 1) {
            await this.topicModel.updateOne(
              { _id: new Types.ObjectId(topicId) },
              {
                $inc: {
                  support_count: 1,
                  oppose_count: -1,
                },
              },
            );
          } else {
            await this.topicModel.updateOne(
              { _id: new Types.ObjectId(topicId) },
              {
                $inc: {
                  support_count: -1,
                  oppose_count: 1,
                },
              },
            );
          }
        }
      } else {
        if (type === 0) {
          throw new Error('Reaction type cannot be 0');
        }
        // Create new reaction
        await this.reactionModel.create({
          topic_id: new Types.ObjectId(topicId),
          user_id: new Types.ObjectId(userId),
          type,
        });

        // Update count
        if (type === 1) {
          await this.topicModel.updateOne(
            { _id: new Types.ObjectId(topicId) },
            { $inc: { support_count: 1 } },
          );
        } else if (type === 2) {
          await this.topicModel.updateOne(
            { _id: new Types.ObjectId(topicId) },
            { $inc: { oppose_count: 1 } },
          );
        }
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getUserReaction(
    topicId: string,
    userId: string,
  ): Promise<number | null> {
    const reaction = await this.reactionModel.findOne({
      topic_id: new Types.ObjectId(topicId),
      user_id: new Types.ObjectId(userId),
    });
    return reaction ? reaction.type : null;
  }
}
