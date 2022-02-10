// task.entity.ts

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BoardColumn } from '../../board-columns/entities/board-column.entity';
import { BoardColumnId } from '../../board-columns/interfaces/board-columns.interface';
import { Board } from '../../boards/entities/board.entity';
import { BoardId } from '../../boards/interfaces/board.interface';
import { UUIDApiPropertyName } from '../../common/types';
import { User } from '../../users/entities/user.entity';
import { UserId } from '../../users/interfaces/user.interface';
import { TaskId } from '../interfaces/task.interface';

@Entity('task', { orderBy: { taskId: 'ASC', order: 'ASC' } })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', type: UUIDApiPropertyName })
  taskId!: TaskId;

  @Column('varchar')
  @ApiProperty()
  title!: string;

  @Column('int')
  @ApiProperty()
  order!: number;

  @Column('varchar')
  @ApiProperty()
  description?: string = '';

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  @ApiHideProperty()
  user!: User;

  @Column({ nullable: true })
  @ApiProperty({ type: UUIDApiPropertyName })
  userId!: UserId;

  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  @ApiHideProperty()
  board!: Board;

  @Column({ nullable: false })
  @ApiProperty({ type: UUIDApiPropertyName })
  boardId!: BoardId;

  @ManyToOne(() => BoardColumn, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'columnId' })
  @ApiHideProperty()
  boardColumn!: BoardColumn;

  @Column({ nullable: true })
  @ApiProperty({ type: UUIDApiPropertyName })
  columnId!: BoardColumnId;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}

// __EOF__
