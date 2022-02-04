// all-exceptions.filter.ts

import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter<T> extends BaseExceptionFilter<T> {
  constructor(private readonly logger: LoggerService) {
    super();
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: T, host: ArgumentsHost) {
    this.logger.error('Exception caught', exception);
    super.catch(exception, host);
  }
}

// __EOF__
