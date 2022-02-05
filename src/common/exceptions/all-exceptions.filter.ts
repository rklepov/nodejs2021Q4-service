// all-exceptions.filter.ts

import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter<T> extends BaseExceptionFilter<T> {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }

    this.logger.setContext(AllExceptionsFilter.name);
    this.logger.assign({ exception });
    this.logger.error('Exception caught');
    return super.catch(exception, host);
  }
}

// __EOF__
