// files-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(Error)
export class FilesExceptionFilter<T extends Error> extends BaseExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }

    return super.catch(
      new ServiceUnavailableException(
        `${exception.name}: ${exception.message}`,
      ),
      host,
    );
  }
}

// __EOF__
