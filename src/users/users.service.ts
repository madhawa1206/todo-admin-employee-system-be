import { Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.userRepo.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const defaultAdmin = this.userRepo.create({
        firstName: 'Default',
        lastName: 'admin',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: Role.ADMIN,
        department: 'Management',
      });

      await this.userRepo.save(defaultAdmin);
      this.logger.log('Default admin user created (username: admin, password: admin123)');
    } else {
      this.logger.log('Default admin already exists');
    }
  }

  async findAll() {
    return this.userRepo.find({ relations: ['tasks'] });
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  async delete(id: number) {
    const user = await this.findById(id);
    return this.userRepo.remove(user);
  }

  async getAnalytics() {
    const users = await this.userRepo.find({ relations: ['tasks'] });

    return users.map((user) => ({
      employeeId: user.id,
      username: user.username,
      department: user.department,
      completedTasks: user.tasks?.filter((t) => t.completed).length || 0,
      totalTasks: user.tasks?.length || 0,
    }));
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  async validateUser(loginDto: { username: string; password: string }): Promise<User | null> {
    const user = await this.findByUsername(loginDto.username);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async create(dto: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: Role;
    department: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
      department: dto.department,
    });
    return this.userRepo.save(user);
  }
}
