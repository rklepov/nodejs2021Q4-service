// create-task.dto.ts

import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { UserId } from '../../users/interfaces/user.interface';
import { BoardColumnId } from '../interfaces/task.interface';

export class CreateTaskDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title = '';

  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order = NaN;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  userId?: UserId;

  @IsOptional()
  @IsUUID()
  columnId?: BoardColumnId;
}

// __EOF__
