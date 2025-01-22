import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { InputUserDto } from '../dto/User.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/services/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiBody({ type: CreateUserDto })
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

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        message: { type: 'string', example: 'Login Successfully' },
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiBody({ type: InputUserDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    const token = this.authService.login(req.user.id);
    return {
      message: 'Login Successfully',
      token,
      user: {
        email: req.user.email,
        roles: req.user.roles,
      },
    };
  }
}
