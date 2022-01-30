// board-columns.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoardId } from '../boards/interfaces/board.interface';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import { BoardColumn } from './entities/board-column.entity';
import { BoardColumnId } from './interfaces/board-columns.interface';

@Injectable()
export class BoardColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private colsRepository: Repository<BoardColumn>,
  ) {}

  async create(boardId: BoardId, createBoardColumnDto: CreateBoardColumnDto) {
    return new BoardColumn(
      await this.colsRepository.save({ ...createBoardColumnDto, boardId }),
    );
  }

  async findAll(boardId: BoardId) {
    return this.colsRepository.find({ boardId });
  }

  async findOne(boardId: BoardId, columnId: BoardColumnId) {
    const col = await this.colsRepository.findOne({ boardId, columnId });
    if (!col) {
      throw new NotFoundException({ boardId, columnId });
    }
    return col;
  }

  async edit(
    boardId: BoardId,
    columnId: BoardColumnId,
    editBoardColumnDto: CreateBoardColumnDto,
  ) {
    const col = await this.colsRepository.findOne({
      boardId,
      columnId,
    });
    if (col) {
      return new BoardColumn(
        await this.colsRepository.save({
          ...editBoardColumnDto,
          boardId,
          columnId,
        }),
      );
    }
    throw new NotFoundException({ boardId, columnId });
  }

  async update(
    boardId: BoardId,
    columnId: BoardColumnId,
    updateBoardColumnDto: UpdateBoardColumnDto,
  ) {
    const col = await this.colsRepository.findOne({
      select: Object.keys(
        updateBoardColumnDto,
      ) as (keyof UpdateBoardColumnDto)[],
      where: { boardId, columnId },
    });

    if (col) {
      return new BoardColumn(
        await this.colsRepository.save({
          ...col,
          ...updateBoardColumnDto,
          boardId,
          columnId,
        }),
      );
    }
    throw new NotFoundException({ boardId, columnId });
  }

  async remove(boardId: BoardId, columnId: BoardColumnId) {
    const result = await this.colsRepository.delete({ boardId, columnId });
    if (!result.affected) {
      throw new NotFoundException({ boardId, columnId });
    }
    return !!result.affected;
  }
}

// __EOF__
