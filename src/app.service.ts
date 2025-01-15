import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  getHello(): string {
    return 'Hello World!';
  }
  async register(user: { email: string; password: string }) {
    const { email, password } = user;
    //Check fields
    if (!user.email || !user.password) {
      return 'All fields must be filled';
    }
    //Check Database if Email already existed
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return 'User already existes';
    }
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Save new to Database
    const newUser = new this.userModel({ email, password: hashedPassword });
    newUser.save();
    return 'Register Successfully';
  }

  async login(user: { email: string; password: string }) {
    //Check fields
    const { email, password } = user;
    if (!email || !password) {
      return 'All fields must be filled';
    }
    //Check if user's info fit the Database
    const CheckUser = await this.userModel.findOne({ email });
    if (CheckUser) {
      if (bcrypt.compare(password, CheckUser.password)) {
        return 'Login Successfully';
      } else {
        return 'Please check your password';
      }
    } else {
      return 'No account fits this email';
    }
  }
}
