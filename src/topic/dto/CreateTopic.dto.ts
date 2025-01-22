// This file will define the CreateTopic DTO
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The title of the topic' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'The description of the topic' })
  description: string;
}
