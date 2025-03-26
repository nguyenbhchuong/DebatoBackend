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
    try {
      const { email } = createUser;
      console.log('controller', createUser);

      const existingUser = await this.usersService.findOne(email);
      if (existingUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'User already exists' });
      }

      const createdUser = await this.usersService.create(createUser);
      return res.status(HttpStatus.CREATED).json(createdUser);
    } catch (error) {
      console.error('Registration error:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating user' });
    }
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        message: { type: 'string', example: 'Login Successfully' },
        user: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
          },
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
  async login(@Req() req, @Res() res: Response) {
    const { token, cookieOptions } = this.authService.login(req.user.id);

    res.cookie('jwt', token, cookieOptions);

    return res.json({
      message: 'Login Successfully',
      user: {
        email: req.user.email,
        roles: req.user.roles,
      },
    });
  }
}
