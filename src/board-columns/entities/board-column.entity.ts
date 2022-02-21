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

import { BoardId, IBoard } from '../../boards/interfaces/board.interface';
import {
  BoardColumnId,
  IBoardColumn,
} from '../interfaces/board-columns.interface';

@Entity('board_column', {
  // ! https://github.com/typeorm/typeorm/issues/2620
  orderBy: { columnId: 'ASC', order: 'ASC' },
})
@Expose()
export class BoardColumn implements IBoardColumn {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id', groups: ['board-column'] })
  @ApiProperty({ name: 'id', format: 'uuid' })
  columnId?: BoardColumnId;

  @Column('varchar')
  @ApiProperty()
  title!: string;

  @Column('int')
  @ApiProperty()
  order!: number;

  @ManyToOne('Board', {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'boardId' })
  @ApiHideProperty()
  board?: IBoard;

  @Column('uuid', { nullable: false })
  @Exclude({ toPlainOnly: true })
  @ApiProperty({ format: 'uuid' })
  boardId?: BoardId;

  constructor(partial: Partial<BoardColumn>) {
    Object.assign(this, partial);
  }
}

// __EOF__
