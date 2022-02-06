// files-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggerService } from '../../common/logger/logger.service';

@Catch(Error)
export class FilesExceptionFilter<T extends Error> extends BaseExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }

    this.logger.pino.setContext(FilesExceptionFilter.name);
    this.logger.pino.assign({ exception });
    this.logger.error('Exception caught');

    return super.catch(
      new ServiceUnavailableException(
        `${exception.name}: ${exception.message}`,
      ),
      host,
    );
  }
}

// __EOF__
