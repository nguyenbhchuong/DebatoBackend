import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUser.dto';

interface GoogleUserData {
  email: string;
  googleId: string;
  displayName: string;
  isEmailVerified: boolean;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    return this.userModel.findOne({ googleId });
  }

  async createGoogleUser(userData: GoogleUserData): Promise<User> {
    const createdUser = new this.userModel({
      ...userData,
      roles: ['user'],
    });
    return createdUser.save();
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        googleId,
        isEmailVerified: true,
      },
      { new: true },
    );
  }
}
