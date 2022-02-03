// database-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class DatabaseExceptionFilter<
  T extends TypeORMError,
> extends BaseExceptionFilter<Error> {
  catch(exception: T, host: ArgumentsHost) {
    const message = `${exception.name}: ${exception.message}`;
    super.catch(new ServiceUnavailableException(message), host);
  }
}

//__EOF__
