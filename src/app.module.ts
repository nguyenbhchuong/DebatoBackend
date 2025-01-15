import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://debato:${process.env.MONGODB_PASSWORD}@debato.wu7yd.mongodb.net/dev?retryWrites=true&w=majority&appName=Debato`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// gBkUp9NdaMm0S3q0
