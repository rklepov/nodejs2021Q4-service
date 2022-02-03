// files.module.ts

import * as multer from 'multer';
import path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { LoggerModule } from '../common/logger/logger.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule,
    LoggerModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: multer.diskStorage({
          // TODO: this is duplicated in FilesService constructor
          destination: path.join(
            __dirname,
            '../../',
            configService.get<string>('STATIC_DIR') || 'static',
          ),
          filename: (req, file, callback) => {
            callback(null, file.originalname);
          },
        }),
      }),
    }),
  ],
})
export class FilesModule {}

// __EOF__
