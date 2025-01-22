// This file will define the CreateTopic DTO
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  // Define properties for the DTO
  @ApiProperty({ description: 'The title of the topic' })
  title: string;

  @ApiProperty({ description: 'The description of the topic' })
  description: string;
}
