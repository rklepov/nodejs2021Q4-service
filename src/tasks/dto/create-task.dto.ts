// create-task.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { BoardColumnId } from '../../board-columns/interfaces/board-columns.interface';
import { UserId } from '../../users/interfaces/user.interface';

export class CreateTaskDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @ApiProperty()
  order!: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string = '';

  @IsOptional()
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  userId?: UserId;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  columnId?: BoardColumnId;
}

// __EOF__
