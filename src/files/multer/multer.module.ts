// multer.module.ts

import dotenv from 'dotenv';
import * as multer from 'multer';
import path from 'path';

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule as ExpressMulterModule } from '@nestjs/platform-express';

import { FastifyMulterModule } from 'fastify-file-interceptor';

dotenv.config({
  path: path.join(__dirname, '../../../.env'),
});

const { USE_FASTIFY } = process.env;

@Module({ imports: [ConfigModule] })
export class MulterModule {
  static register(): DynamicModule {
    // TODO !!!
    const Factory =
      USE_FASTIFY?.toLowerCase() === 'true'
        ? FastifyMulterModule
        : ExpressMulterModule;

    return Factory.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: multer.diskStorage({
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
