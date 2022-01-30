// user.entity.ts

import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserId } from '../interfaces/user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id' })
  userId!: UserId;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  login!: string;

  @Column('varchar')
  @Exclude({ toPlainOnly: true })
  password!: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

// __EOF__
