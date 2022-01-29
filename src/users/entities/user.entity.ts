// user.entity.ts

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
  password!: string;
}

// __EOF__
