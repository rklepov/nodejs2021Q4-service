// users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import pick from 'lodash.pick';
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
    return new User(await this.usersRepository.save(createUserDto));
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

  async edit(userId: UserId, editUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ userId });
    if (user) {
      return new User(
        await this.usersRepository.save({ ...editUserDto, userId }),
      );
    }
    throw new NotFoundException({ userId });
  }

  async update(userId: UserId, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      select: Object.keys(updateUserDto) as (keyof CreateUserDto)[],
      where: { userId },
    });

    if (user) {
      return new User(
        await this.usersRepository.save({ ...user, ...updateUserDto, userId }),
      );
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
