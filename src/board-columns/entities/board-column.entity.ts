// board-column.entity.ts

import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// TODO:
// eslint-disable-next-line import/no-cycle
import { Board } from '../../boards/entities/board.entity';
import { BoardId } from '../../boards/interfaces/board.interface';
import { BoardColumnId } from '../interfaces/board-columns.interface';

@Entity('board_column', {
  // ! https://github.com/typeorm/typeorm/issues/2620
  orderBy: { columnId: 'ASC', order: 'ASC' },
})
@Expose()
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id', groups: ['board-column'] })
  columnId?: BoardColumnId;

  @Column('varchar')
  title = '';

  @Column('int')
  order = NaN;

  @ManyToOne('Board', {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'boardId' })
  // TODO: replace with an interface to break cycle dependency ?
  board?: Board;

  @Column('uuid', { nullable: false })
  @Exclude({ toPlainOnly: true })
  boardId?: BoardId;

  constructor(partial: Partial<BoardColumn>) {
    Object.assign(this, partial);
  }
}

// __EOF__
