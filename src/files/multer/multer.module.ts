// multer.module.ts

import * as expressMulter from 'multer';
import path from 'path';

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule as ExpressMulterModule } from '@nestjs/platform-express';

@Module({ imports: [ConfigModule] })
export class MulterModule {
  static register(): DynamicModule {
    return ExpressMulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: expressMulter.diskStorage({
          // TODO: this is duplicated in FilesService constructor
          destination: path.join(
            __dirname,
            '../../../',
            config.get('STATIC_DIR', 'static'),
          ),
          filename: (req, file, callback) => {
            callback(null, file.originalname);
          },
        }),
      }),
    });
  }
}

// __EOF__
