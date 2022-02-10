// board.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BoardColumn } from '../../board-columns/entities/board-column.entity';
import { BoardId, IBoard } from '../interfaces/board.interface';

@Entity()
export class Board implements IBoard {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', format: 'uuid' })
  boardId!: BoardId;

  @Column('varchar')
  @ApiProperty()
  title!: string;

  @OneToMany(() => BoardColumn, (col) => col.board, {
    eager: true,
    cascade: true,
  })
  columns!: BoardColumn[];

  constructor(partial: Partial<Board>) {
    if (partial) {
      const columns = partial.columns?.map((col) => new BoardColumn(col)) ?? [];
      Object.assign(partial, { columns });
    }
    Object.assign(this, partial);
  }
}

// __EOF__
