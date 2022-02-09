// update-board-column.dto.ts

import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBoardColumnDto /* extends PartialType(CreateBoardColumnDto) */ {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order?: number;
}

// __EOF__
