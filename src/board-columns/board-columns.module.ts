// board-columns.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardColumnsController } from './board-columns.controller';
import { BoardColumnsService } from './board-columns.service';
import { BoardColumn } from './entities/board-column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn])],
  controllers: [BoardColumnsController],
  providers: [BoardColumnsService],
})
export class BoardColumnsModule {}

// __EOF__
