// tasks.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoardId } from '../boards/interfaces/board.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskId } from './interfaces/task.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(boardId: BoardId, createTaskDto: CreateTaskDto) {
    return new Task(
      await this.tasksRepository.save({ ...createTaskDto, boardId }),
    );
  }

  async findAll(boardId: BoardId) {
    return this.tasksRepository.find({ boardId });
  }

  async findOne(boardId: BoardId, taskId: TaskId) {
    const task = await this.tasksRepository.findOne({ boardId, taskId });
    if (!task) {
      throw new NotFoundException({ boardId, taskId });
    }
    return task;
  }

  async edit(boardId: BoardId, taskId: TaskId, editTaskDto: CreateTaskDto) {
    const task = await this.tasksRepository.findOne({ boardId, taskId });
    if (task) {
      return new Task(
        await this.tasksRepository.save({ ...editTaskDto, boardId, taskId }),
      );
    }
    throw new NotFoundException({ boardId, taskId });
  }

  async update(boardId: BoardId, taskId: TaskId, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepository.findOne({
      select: Object.keys(updateTaskDto) as (keyof UpdateTaskDto)[],
      where: { boardId, taskId },
    });

    if (task) {
      return new Task(
        await this.tasksRepository.save({
          ...task,
          ...updateTaskDto,
          boardId,
          taskId,
        }),
      );
    }
    throw new NotFoundException({ boardId, taskId });
  }

  async remove(boardId: BoardId, taskId: TaskId) {
    const result = await this.tasksRepository.delete({ boardId, taskId });
    if (!result.affected) {
      throw new NotFoundException({ boardId, taskId });
    }
    return !!result.affected;
  }
}

// __EOF__
