import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDetailsDto } from './dto/update-task-details.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async assignTask(dto: AssignTaskDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.assignToUserId },
    });

    if (!user) throw new NotFoundException('Assigned user not found');

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      assignedTo: user,
      completed: false,
    });

    return this.taskRepository.save(task);
  }

  async createTask(dto: CreateTaskDto, currentUser: User) {
    const user = await this.userRepository.findOne({
      where: { id: dto.assignedToUserId },
    });

    if (!user) throw new NotFoundException('Assigned user not found');

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      assignedTo: user,
      createdBy: currentUser,
      completed: false,
      priority: dto.priority,
      dueDate: dto.dueDate,
    });

    return this.taskRepository.save(task);
  }

  async getUserTasks(userId: number) {
    return this.taskRepository.find({
      where: { assignedTo: { id: userId } },
      relations: ['assignedTo'],
    });
  }

  async getAllTasksAndUsers() {
    return this.taskRepository.find({
      relations: ['assignedTo'],
    });
  }

  async updateTaskDetails(taskId: number, dto: UpdateTaskDetailsDto, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignedTo'],
    });

    if (!task) throw new NotFoundException('Task not found');

    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can update task details');
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.dueDate !== undefined) task.dueDate = dto.dueDate;

    if (dto.assignedToUserId !== undefined) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: dto.assignedToUserId },
      });
      if (!assignedUser) throw new NotFoundException('Assigned user not found');
      task.assignedTo = assignedUser;
    }

    return this.taskRepository.save(task);
  }

  async updateTaskStatus(taskId: number, dto: UpdateTaskStatusDto, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignedTo'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const isAdmin = user.role === 'admin';
    const isOwner = task.assignedTo?.id === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    if (dto.completed !== undefined) {
      task.completed = dto.completed;
    }

    return this.taskRepository.save(task);
  }

  async deleteTask(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
