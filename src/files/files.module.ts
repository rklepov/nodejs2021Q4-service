// files.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '../common/logger/logger.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from './multer/multer.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, LoggerModule, MulterModule.register()],
})
export class FilesModule {}

// __EOF__
