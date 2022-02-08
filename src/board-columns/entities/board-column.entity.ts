// board-column.entity.ts

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ name: 'id' })
  columnId?: BoardColumnId;

  @Column('varchar')
  title!: string;

  @Column('int')
  order!: number;

  @ManyToOne('Board', {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'boardId' })
  @ApiHideProperty()
  board?: Board; // TODO: replace with an interface to break cycle dependency ?

  @Column('uuid', { nullable: false })
  @Exclude({ toPlainOnly: true })
  boardId?: BoardId;

  constructor(partial: Partial<BoardColumn>) {
    Object.assign(this, partial);
  }
}

// __EOF__
