// boards.controller.ts

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
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardId } from './interfaces/board.interface';

@ApiTags('Boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':boardId')
  findOne(@Param('boardId', ParseUUIDPipe) boardId: BoardId) {
    return this.boardsService.findOne(boardId);
  }

  @Put(':boardId')
  edit(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.edit(boardId, createBoardDto);
  }

  @Patch(':boardId')
  update(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(boardId, updateBoardDto);
  }

  @Delete(':boardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('boardId', ParseUUIDPipe) boardId: BoardId) {
    await this.boardsService.remove(boardId);
  }
}

// __EOF__
