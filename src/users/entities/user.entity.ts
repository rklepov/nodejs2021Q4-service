// user.entity.ts

import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserId } from '../interfaces/user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId!: UserId;

  @Column('varchar')
  name = '';

  @Column('varchar')
  login!: string;

  @Column('varchar')
  @Exclude()
  password!: string;
}

// __EOF__
