// users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserId } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // TODO: password hash!
    return this.usersRepository.save(createUserDto);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(userId: UserId) {
    const user = await this.usersRepository.findOne({ userId });
    if (!user) {
      throw new NotFoundException({ userId });
    }
    return user;
  }

  async edit(userId: UserId, editUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({ userId });
    if (user) {
      // TODO: password hash!
      return this.usersRepository.save({ ...editUserDto, userId });
    }
    throw new NotFoundException({ userId });
  }

  async update(userId: UserId, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ userId });
    if (user) {
      // TODO: password hash!
      return this.usersRepository.save({ ...user, ...updateUserDto, userId });
    }
    throw new NotFoundException({ userId });
  }

  async remove(userId: UserId) {
    const result = await this.usersRepository.delete({ userId });
    if (!result.affected) {
      throw new NotFoundException({ userId });
    }
    return !!result.affected;
  }
}

// __EOF__
