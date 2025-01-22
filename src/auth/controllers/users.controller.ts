import { Body, Controller, HttpStatus, Post, Res, Req } from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { InputUserDto } from '../dto/User.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/services/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';

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
    status: 400,
    description: 'User not found or invalid credentials',
  })
  @ApiBody({ type: InputUserDto })
  @Post('login')
  async verifyUser(
    @Body() inputUser: InputUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { email, password } = inputUser;
    const checkUser = await this.usersService.findOne(email);
    if (checkUser) {
      if (await bcrypt.compare(password, checkUser.password)) {
        const id: string = checkUser._id.toString();
        const token = this.authService.login(id);
        res
          .status(HttpStatus.OK)
          .json({ message: 'Login Successfully', token: token });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'User not found' });
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'User not found' });
    }
  }
}
