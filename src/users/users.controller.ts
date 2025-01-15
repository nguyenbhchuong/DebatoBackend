import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto} from './dto/CreateUser.dto';
import { InputUserDto} from './dto/User.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('register')
  async createUser(@Body() createUser: CreateUserDto, @Res() res: Response) {
    const { email } = createUser;
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User already exists' });
    } else {
      const createdUser = await this.usersService.create(createUser);
      res.status(HttpStatus.CREATED).json(createdUser);
    }
  }

  @Post('login')
  async verifyUser(@Body() inputUser: InputUserDto, @Res() res:Response) {
    const {email, password} = inputUser;
    const checkUser = await this.usersService.findOne(email);
    if (checkUser) {
       if (await bcrypt.compare(password, checkUser.password)) {
        res
          .status(HttpStatus.OK)
          .json({message: "Login Successfully"});
       } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({message: "User not found"});
       }
    } else {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({message: "User not found"});
    }
  }
}
