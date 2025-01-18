import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
