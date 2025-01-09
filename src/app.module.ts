import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://chuongnguyenbaohoang:gBkUp9NdaMm0S3q0@windway.gixju.mongodb.net/?retryWrites=true&w=majority&appName=windway',
    ),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// gBkUp9NdaMm0S3q0
