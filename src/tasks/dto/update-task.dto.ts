// update-task.dto.ts

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { UserId } from '../../users/interfaces/user.interface';
import { BoardColumnId } from '../interfaces/task.interface';

export class UpdateTaskDto /* extends PartialType(CreateTaskDto) */ {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order?: number;

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