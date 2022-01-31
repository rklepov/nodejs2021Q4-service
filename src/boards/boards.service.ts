// boards.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { BoardId } from './interfaces/board.interface';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    return this.boardsRepository.save(new Board(createBoardDto));
  }

  async findAll() {
    const boards = await this.boardsRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.columns', 'column')
      .orderBy({ 'board.boardId': 'ASC', 'column.order': 'ASC' })
      .getMany();

    return boards;
  }

  async findOne(boardId: BoardId) {
    const board = await this.boardsRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.columns', 'column')
      .where('board.boardId = :boardId', { boardId })
      .orderBy({ 'board.boardId': 'ASC', 'column.order': 'ASC' })
      .getOne();

    if (!board) {
      throw new NotFoundException({ boardId });
    }

    return board;
  }

  async edit(boardId: BoardId, editBoardDto: CreateBoardDto) {
    const board = await this.boardsRepository.findOne({ boardId });

    if (board) {
      // TODO: the columns are completely replaced rather than merged
      // ? probably this is fine for PUT ?
      return this.boardsRepository.save(
        new Board({ ...editBoardDto, boardId }),
      );
    }
    throw new NotFoundException({ boardId });
  }

  async update(boardId: BoardId, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardsRepository.findOne({
      select: Object.keys(updateBoardDto) as (keyof UpdateBoardDto)[],
      where: { boardId },
    });

    if (board) {
      // TODO: the columns are completely replaced rather than merged
      //       likely no what we expect from PATCH
      return new Board(
        await this.boardsRepository.save({
          ...board,
          ...updateBoardDto,
          boardId,
        }),
      );
    }
    throw new NotFoundException({ boardId });
  }

  async remove(boardId: BoardId) {
    const result = await this.boardsRepository.delete({ boardId });
    if (!result.affected) {
      throw new NotFoundException({ boardId });
    }
    return !!result.affected;
  }
}

// __EOF__
