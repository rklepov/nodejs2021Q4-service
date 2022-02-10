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
import { UUIDApiPropertyName } from '../../common/types';

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
  @ApiProperty({ type: UUIDApiPropertyName })
  userId?: UserId;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: UUIDApiPropertyName })
  columnId?: BoardColumnId;
}

// __EOF__
