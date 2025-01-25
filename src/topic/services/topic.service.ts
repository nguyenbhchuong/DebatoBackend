// This file will define the TopicService class
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Topic, TopicDocument } from '../schemas/topic.schema';
import { CreateTopicDto } from '../dto/CreateTopic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  async create(
    createTopicDto: CreateTopicDto & { user_id: Types.ObjectId },
  ): Promise<Topic> {
    const createdTopic = new this.topicModel(createTopicDto);
    return createdTopic.save();
  }

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().exec();
  }

  async findOne(id: string): Promise<Topic> {
    return this.topicModel.findById(id).exec();
  }

  async update(id: string, updateTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicModel
      .findByIdAndUpdate(id, { $set: updateTopicDto }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.topicModel.findByIdAndDelete(id).exec();
  }
}
