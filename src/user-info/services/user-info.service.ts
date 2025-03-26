import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserInfo, UserInfoDocument } from '../schemas/user-info.schema';
import { CreateUserInfoDto } from '../dto/create-user-info.dto';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
  ) {}

  async create(
    userId: string,
    createUserInfoDto: CreateUserInfoDto,
  ): Promise<UserInfo> {
    // Check if idName exists
    let { idName } = createUserInfoDto;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existing = await this.userInfoModel.findOne({ idName }).exec();
      if (!existing) {
        isUnique = true;
      } else {
        idName = `${createUserInfoDto.idName}${counter}`;
        counter++;
      }
    }

    const userInfo = new this.userInfoModel({
      userId: new Types.ObjectId(userId),
      ...createUserInfoDto,
      idName, // Use the potentially modified idName
    });
    return userInfo.save();
  }

  async findByUserId(userId: string): Promise<UserInfo> {
    const userInfo = await this.userInfoModel
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!userInfo) {
      throw new NotFoundException('User info not found');
    }
    return userInfo;
  }

  async update(
    userId: string,
    updateUserInfoDto: Partial<CreateUserInfoDto>,
  ): Promise<UserInfo> {
    const userInfo = await this.userInfoModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: updateUserInfoDto },
        { new: true },
      )
      .exec();

    if (!userInfo) {
      throw new NotFoundException('User info not found');
    }
    return userInfo;
  }

  async updateCredit(userId: string, amount: number): Promise<UserInfo> {
    const userInfo = await this.userInfoModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $inc: { credit: amount } },
        { new: true },
      )
      .exec();

    if (!userInfo) {
      throw new NotFoundException('User info not found');
    }
    return userInfo;
  }

  // Add a method to check if idName exists
  async isIdNameTaken(idName: string): Promise<boolean> {
    const existing = await this.userInfoModel.findOne({ idName }).exec();
    return !!existing;
  }
}
