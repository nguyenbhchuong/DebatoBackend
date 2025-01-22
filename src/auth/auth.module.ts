import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, UsersService],
  controllers: [AuthController, UsersController],
})
export class AuthModule {}
