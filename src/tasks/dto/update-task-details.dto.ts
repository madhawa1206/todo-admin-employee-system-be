// src/tasks/dto/update-task-details.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { TaskPriority } from '../task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDetailsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  assignedToUserId?: number;
}
