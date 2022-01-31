// create-board.dto.ts

import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateBoardColumnDto } from '../../board-columns/dto/create-board-column.dto';

export class CreateBoardDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title = '';

  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateBoardColumnDto)
  columns?: CreateBoardColumnDto[];
}

// __EOF__
