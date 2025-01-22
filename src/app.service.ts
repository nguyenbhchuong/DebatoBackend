import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './auth/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  getHello(): string {
    return 'Hello World!';
  }
}
