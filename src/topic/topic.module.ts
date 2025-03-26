// This file will define the TopicModule class
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicController } from './controllers/topic.controller';
import { TopicService } from './services/topic.service';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserInfoModule } from '../user-info/user-info.module';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { PubSubService } from '../shared/services/pub-sub.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/topics',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allow only certain file types
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/jfif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/octet-stream', // For general file uploads
        ];

        if (!file.mimetype || allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
    UserInfoModule,
  ],
  controllers: [TopicController],
  providers: [TopicService, PubSubService],
})
export class TopicModule {}
