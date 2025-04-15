import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({ example: true, description: 'Mark task as completed or not' })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({
    example: 3,
    description: 'Assign task to another user (admin only)',
  })
  @IsOptional()
  @IsNumber()
  assignedTo?: number;
}
