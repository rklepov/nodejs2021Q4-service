// files.service.ts

import { open, readdir, unlink } from 'fs/promises';
import path from 'path';

import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggerService } from '../common/logger/logger.service';
import { FileName } from './interfaces/file.interface';

// TODO: exception filter for filesystem operations
@Injectable()
export class FilesService {
  private readonly rootDir: string;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    // TODO: this is duplicated in FilesModule
    this.rootDir = path.join(
      __dirname,
      '../../',
      this.config.get<string>('STATIC_DIR') || 'static',
    );

    this.logger.setContext(FilesService.name);
  }

  async list() {
    return readdir(this.rootDir);
  }

  async read(filename: FileName) {
    try {
      const filepath = this.getFilePath(filename);

      this.logger.debug(`downloading from '${filepath}'`);

      const handle = await open(filepath, 'r');
      const stream = handle.createReadStream();

      return new StreamableFile(stream);
    } catch (e) {
      // the most likely error is that the requested file doesn't exist
      this.logger.error(e);

      throw new NotFoundException(filename);
    }
  }

  async remove(filename: string) {
    const filepath = this.getFilePath(filename);
    this.logger.debug(`deleting '${filepath}'`);

    await unlink(filepath);
  }

  private getFilePath(filename: FileName) {
    return path.join(this.rootDir, filename);
  }
}

// __EOF__
