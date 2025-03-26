import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserInfoService } from '../services/user-info.service';
import { CreateUserInfoDto } from '../dto/create-user-info.dto';
import { UserInfo } from '../schemas/user-info.schema';

@ApiTags('User Info')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Post()
  @ApiOperation({ summary: 'Create user info' })
  @ApiResponse({ status: 201, description: 'User info created successfully' })
  async create(
    @Req() req,
    @Body() createUserInfoDto: CreateUserInfoDto,
  ): Promise<UserInfo> {
    return this.userInfoService.create(req.user.sub, createUserInfoDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'Returns user info' })
  async findMe(@Req() req): Promise<UserInfo> {
    return this.userInfoService.findByUserId(req.user.sub);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user info by user ID' })
  @ApiResponse({ status: 200, description: 'Returns user info' })
  async findByUserId(@Param('userId') userId: string): Promise<UserInfo> {
    return this.userInfoService.findByUserId(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user info' })
  @ApiResponse({ status: 200, description: 'User info updated successfully' })
  async update(
    @Req() req,
    @Body() updateUserInfoDto: Partial<CreateUserInfoDto>,
  ): Promise<UserInfo> {
    return this.userInfoService.update(req.user.sub, updateUserInfoDto);
  }
}
