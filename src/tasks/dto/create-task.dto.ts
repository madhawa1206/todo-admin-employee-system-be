import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { TaskPriority } from '../task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete employee onboarding' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Ensure all paperwork is done and setup access' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ example: '2025-04-20' })
  @IsNotEmpty()
  @IsString()
  dueDate: string;

  @ApiProperty({ example: 5, description: 'User ID to assign the task to' })
  @IsNotEmpty()
  @IsNumber()
  assignedToUserId: number;
}
