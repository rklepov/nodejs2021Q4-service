// update-board.dto.ts

import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { UpdateBoardColumnDto } from '../../board-columns/dto/update-board-column.dto';

export class UpdateBoardDto /* extends PartialType(CreateBoardDto) */ {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UpdateBoardColumnDto)
  columns?: UpdateBoardColumnDto[];
}

// __EOF__
