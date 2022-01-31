// task.entity.ts

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
import { BoardId } from '../../boards/interfaces/board.interface';
import { User } from '../../users/entities/user.entity';
import { UserId } from '../../users/interfaces/user.interface';
import { TaskId } from '../interfaces/task.interface';

@Entity('task', { orderBy: { taskId: 'ASC', order: 'ASC' } })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id' })
  taskId!: TaskId;

  @Column('varchar')
  title = '';

  @Column('int')
  order = NaN;

  @Column('varchar')
  description? = '';

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: true })
  userId!: UserId;

  @Column('uuid', { nullable: /* false */ true })
  boardId?: BoardId; // TODO: ManyToOne to board

  @ManyToOne(() => BoardColumn, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'columnId' })
  boardColumn!: BoardColumn;

  @Column({ nullable: true })
  columnId!: BoardColumnId;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}

// __EOF__
