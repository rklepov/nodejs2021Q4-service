// file.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor as FileExpressInterceptor } from '@nestjs/platform-express';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';
import { diskStorage } from 'multer';

import { FilesService } from '../files.service';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  private readonly fileInterceptor: NestInterceptor;

  constructor(
    private readonly config: ConfigService,
    private readonly filesService: FilesService,
  ) {
    const useFastify = config.get<string>('USE_FASTIFY', 'false');
    const ClassFactory =
      useFastify.toLowerCase() === 'true'
        ? FileFastifyInterceptor
        : FileExpressInterceptor;

    const storageOptions = {
      storage: diskStorage({
        destination: filesService.rootDir,
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    };

    this.fileInterceptor = new (ClassFactory('file', storageOptions))();
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return this.fileInterceptor.intercept(context, next);
  }
}

// __EOF__
