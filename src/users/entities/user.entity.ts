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

  @Column('varchar', { unique: true, nullable: false })
  login!: string;

  @Column('varchar', { nullable: false })
  @Exclude({ toPlainOnly: true })
  password!: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

// __EOF__
