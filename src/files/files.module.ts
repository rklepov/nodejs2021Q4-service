// files.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '../common/logger/logger.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileInterceptor } from './multer/file.interceptor';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileInterceptor],
  imports: [ConfigModule, LoggerModule],
})
export class FilesModule {}

// __EOF__
