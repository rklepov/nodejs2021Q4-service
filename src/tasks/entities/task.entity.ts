// task.entity.ts

import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { UserId } from '../../users/interfaces/user.interface';
import { BoardColumnId, BoardId, TaskId } from '../interfaces/task.interface';

@Entity()
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

  @Column('uuid', { nullable: true })
  columnId?: BoardColumnId; // TODO: ManyToOne to column

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}

// __EOF__
