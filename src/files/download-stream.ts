import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import fs from 'fs/promises';
import { Readable } from 'stream';
import { PathLike } from 'fs';

type CallbackType = Parameters<Exclude<Readable['_construct'], undefined>>[0];

export class DownloadStream extends Readable {
  private fd!: fs.FileHandle;

  constructor(private readonly filename: PathLike) {
    super();
  }

  async _construct(callback: CallbackType) {
    try {
      this.fd = await fs.open(this.filename, 'r');
      callback();
    } catch (e) {
      callback(new NotFoundException(e));
    }
  }

  async _read(n: number) {
    try {
      const buf = Buffer.alloc(n);
      const result = await this.fd.read(buf, 0, n, null);
      this.push(result.bytesRead > 0 ? buf.slice(0, result.bytesRead) : null);
    } catch (e) {
      this.destroy(new InternalServerErrorException(e));
    }
  }

  async _destroy(err: Error | null, callback: CallbackType) {
    try {
      if (this.fd) {
        await this.fd.close();
      }
      callback(err);
    } catch (e) {
      callback(e as Error);
    }
  }
}
