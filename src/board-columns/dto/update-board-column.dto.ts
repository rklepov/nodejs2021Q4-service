// update-board-column.dto.ts

import { PartialType } from '@nestjs/swagger';

import { CreateBoardColumnDto } from './create-board-column.dto';

export class UpdateBoardColumnDto extends PartialType(CreateBoardColumnDto) {}

// __EOF__
