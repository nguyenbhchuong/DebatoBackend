import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
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
}
