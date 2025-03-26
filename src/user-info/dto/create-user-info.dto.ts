import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateUserInfoDto {
  @ApiProperty({ description: 'Display name of the user' })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({ description: 'Unique ID name for the user' })
  @IsNotEmpty()
  @IsString()
  idName: string;

  @ApiProperty({ description: 'User credits', default: 0 })
  @IsNumber()
  @Min(0)
  credit: number;
}
