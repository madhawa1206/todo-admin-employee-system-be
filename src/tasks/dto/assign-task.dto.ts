import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({ example: 'Write monthly report' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Summarize team activities for April' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2, description: 'User ID to assign task to' })
  @IsNumber()
  @IsNotEmpty()
  assignToUserId: number;
}
