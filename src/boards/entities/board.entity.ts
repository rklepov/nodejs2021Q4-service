// board.entity.ts

import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// TODO:
// eslint-disable-next-line import/no-cycle
import { BoardColumn } from '../../board-columns/entities/board-column.entity';
import { BoardId } from '../interfaces/board.interface';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id' })
  boardId!: BoardId;

  @Column('varchar')
  title = '';

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
