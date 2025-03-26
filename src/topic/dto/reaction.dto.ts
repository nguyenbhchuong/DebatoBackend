import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({ enum: [1, 2], description: '1 for support, 2 for oppose' })
  @IsNotEmpty()
  @IsEnum([0, 1, 2])
  type: number;
}
