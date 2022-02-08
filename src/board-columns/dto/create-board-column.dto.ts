// create-board-column.dto.ts

import { IsDefined, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBoardColumnDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order!: number;
}

// __EOF__
