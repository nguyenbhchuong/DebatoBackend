// This file will define the TopicModule class
import { Module } from '@nestjs/common';
import { TopicController } from './controllers/topic.controller';
import { TopicService } from './services/topic.service';

@Module({
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
