import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Get,
  Param,
  Request,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDetailsDto } from './dto/update-task-details.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('assign')
  @Roles('admin')
  assignTask(@Body() dto: AssignTaskDto) {
    return this.tasksService.assignTask(dto);
  }

  @Post('create')
  @Roles('admin')
  createTask(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.createTask(dto, req.user);
  }

  @Put(':id/update')
  @ApiParam({ name: 'id', type: Number })
  updateTask(@Param('id') taskId: number, @Body() dto: UpdateTaskStatusDto, @Request() req: any) {
    return this.tasksService.updateTaskStatus(taskId, dto, req.user);
  }

  @Get('my')
  getMyTasks(@Request() req: any) {
    return this.tasksService.getUserTasks(req.user.id);
  }

  @Get('all')
  @Roles('admin')
  getAllTasksAndUsers() {
    return this.tasksService.getAllTasksAndUsers();
  }

  @Get()
  @Roles('admin')
  getAllTasks() {
    return this.tasksService.getAllTasksAndUsers();
  }

  @Put(':id/details')
  @Roles('admin')
  @ApiParam({ name: 'id', type: Number })
  updateTaskDetails(
    @Param('id') taskId: number,
    @Body() dto: UpdateTaskDetailsDto,
    @Request() req: any,
  ) {
    return this.tasksService.updateTaskDetails(taskId, dto, req.user);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', type: Number })
  deleteTask(@Param('id') taskId: number) {
    return this.tasksService.deleteTask(taskId);
  }
}
