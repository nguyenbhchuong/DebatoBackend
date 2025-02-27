import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UserInfoService } from '../../user-info/services/user-info.service';

interface GoogleUserData {
  email: string;
  googleId: string;
  displayName: string;
  isEmailVerified: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userInfoService: UserInfoService,
  ) {}

  private generateDefaultNames(email: string): {
    displayName: string;
    idName: string;
  } {
    const nameBeforeAt = email.split('@')[0];
    return {
      displayName: nameBeforeAt,
      idName: nameBeforeAt,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();

    // Create user info with default values
    const { displayName, idName } = this.generateDefaultNames(email);
    await this.userInfoService.create(savedUser._id.toString(), {
      displayName,
      idName,
      credit: 100,
    });

    return savedUser;
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
    const savedUser = await createdUser.save();

    // Create user info with Google display name or default
    const displayName = userData.displayName || userData.email.split('@')[0];
    const idName = userData.email.split('@')[0];
    await this.userInfoService.create(savedUser._id.toString(), {
      displayName,
      idName,
      credit: 100,
    });

    return savedUser;
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
