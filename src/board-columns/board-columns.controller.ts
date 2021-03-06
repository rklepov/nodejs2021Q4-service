// board-columns.controller.ts

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
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardId } from '../boards/interfaces/board.interface';
import { BoardColumnsService } from './board-columns.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import { BoardColumnId } from './interfaces/board-columns.interface';

@ApiTags('Columns')
@Controller('boards/:boardId/columns')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ groups: ['board-column'] })
export class BoardColumnsController {
  constructor(private readonly boardColumnsService: BoardColumnsService) {}

  @Post()
  create(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Body() createBoardColumnDto: CreateBoardColumnDto,
  ) {
    return this.boardColumnsService.create(boardId, createBoardColumnDto);
  }

  @Get()
  findAll(@Param('boardId', ParseUUIDPipe) boardId: BoardId) {
    return this.boardColumnsService.findAll(boardId);
  }

  @Get(':columnId')
  findOne(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('columnId', ParseUUIDPipe) columnId: BoardColumnId,
  ) {
    return this.boardColumnsService.findOne(boardId, columnId);
  }

  @Put(':columnId')
  edit(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('columnId', ParseUUIDPipe) columnId: BoardColumnId,
    @Body() editBoardColumnDto: CreateBoardColumnDto,
  ) {
    return this.boardColumnsService.edit(boardId, columnId, editBoardColumnDto);
  }

  @Patch(':columnId')
  update(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('columnId', ParseUUIDPipe) columnId: BoardColumnId,
    @Body() updateBoardColumnDto: UpdateBoardColumnDto,
  ) {
    return this.boardColumnsService.update(
      boardId,
      columnId,
      updateBoardColumnDto,
    );
  }

  @Delete(':columnId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('boardId', ParseUUIDPipe) boardId: BoardId,
    @Param('columnId', ParseUUIDPipe) columnId: BoardColumnId,
  ) {
    await this.boardColumnsService.remove(boardId, columnId);
  }
}

// __EOF__
