// board-column.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BoardColumnId } from '../interfaces/board-columns.interface';
import { BoardId } from '../../boards/interfaces/board.interface';

@Entity('board_column', {
  // ! https://github.com/typeorm/typeorm/issues/2620
  orderBy: { columnId: 'ASC', order: 'ASC' },
})
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  columnId?: BoardColumnId;

  @Column('varchar')
  title = '';

  @Column('int')
  order = NaN;

  @Column('uuid', { nullable: /* false */ true })
  boardId?: BoardId; // TODO: ManyToOne to board

  //   @ManyToOne('Board', {
  //     onDelete: 'CASCADE',
  //     orphanedRowAction: 'delete',
  //   })
  //   @JoinColumn({ name: 'boardId' })
  //   board?: Board;

  constructor(partial: Partial<BoardColumn>) {
    Object.assign(this, partial);
  }
}

// __EOF__
