import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
