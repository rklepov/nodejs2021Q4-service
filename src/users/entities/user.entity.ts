// user.entity.ts

import { ConfigService } from '@nestjs/config';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PasswordTransformer } from '../../common/password-transformer';
import { UserId } from '../interfaces/user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ name: 'id' })
  userId!: UserId;

  @Column('varchar')
  @Expose()
  name!: string;

  @Column('varchar', { unique: true, nullable: false })
  @Expose()
  login!: string;

  @Column('varchar', {
    nullable: false,
    transformer: new PasswordTransformer(new ConfigService()),
  })
  @Exclude({ toPlainOnly: true })
  password!: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

// __EOF__
