// tasks.controller.ts

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BoardId, TaskId } from './interfaces/task.interface';
import { TasksService } from './tasks.service';

@Controller('/boards/:boardId/tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(boardId, createTaskDto);
  }

  @Get()
  findAll(@Param('boardId', ParseUUIDPipe) boardId: BoardId) {
    return this.tasksService.findAll(boardId);
  }

  @Get(':taskId')
  findOne(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('taskId', ParseUUIDPipe) taskId: TaskId,
  ) {
    return this.tasksService.findOne(boardId, taskId);
  }

  @Put(':taskId')
  edit(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('taskId', ParseUUIDPipe) taskId: TaskId,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.edit(boardId, taskId, createTaskDto);
  }

  @Patch(':taskId')
  update(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('taskId', ParseUUIDPipe) taskId: TaskId,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(boardId, taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('taskId', ParseUUIDPipe) taskId: TaskId,
  ) {
    return this.tasksService.remove(boardId, taskId);
  }
}

// __EOF__
