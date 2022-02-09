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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardId } from '../boards/interfaces/board.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskId } from './interfaces/task.interface';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('boards/:boardId/tasks')
@UseGuards(JwtAuthGuard)
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
    @Body() editTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.edit(boardId, taskId, editTaskDto);
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
  async remove(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('taskId', ParseUUIDPipe) taskId: TaskId,
  ) {
    await this.tasksService.remove(boardId, taskId);
  }
}

// __EOF__
