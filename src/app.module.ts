import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './auth/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://debato:${process.env.MONGODB_PASSWORD}@debato.wu7yd.mongodb.net/dev?retryWrites=true&w=majority&appName=Debato`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    TopicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// gBkUp9NdaMm0S3q0
