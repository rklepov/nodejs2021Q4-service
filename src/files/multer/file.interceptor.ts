// file.interceptor.ts

import dotenv from 'dotenv';
import * as multer from 'multer';
import path from 'path';

import { FileInterceptor as FileExpressInterceptor } from '@nestjs/platform-express';

import { FileFastifyInterceptor } from 'fastify-file-interceptor';

dotenv.config({
  path: path.join(__dirname, '../../../.env'),
});

const { USE_FASTIFY } = process.env;

type FileExpressInterceptorFactory = typeof FileExpressInterceptor;

type FileFastifyInterceptorFactory = typeof FileFastifyInterceptor;

type FileInterceptorFactory =
  | FileExpressInterceptorFactory
  | FileFastifyInterceptorFactory;

export const FileInterceptor: FileInterceptorFactory = (fieldName: string) => {
  // TODO !!!
  const Factory =
    USE_FASTIFY?.toLowerCase() === 'true'
      ? FileFastifyInterceptor
      : FileExpressInterceptor;

  const storageOptions = {
    storage: multer.diskStorage({
      // TODO: this is duplicated in FilesService constructor
      destination: path.join(
        __dirname,
        '../../../',
        process.env?.STATIC || 'static',
      ),
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    }),
  };

  return Factory(fieldName, storageOptions);
};

// __EOF__
