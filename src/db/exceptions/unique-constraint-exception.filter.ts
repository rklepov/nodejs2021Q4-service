// unique-constraint-exception.filter.ts

import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UniqueConstraintExceptionFilter<
  T extends QueryFailedError,
> extends BaseExceptionFilter<Error> {
  catch(exception: T, host: ArgumentsHost) {
    const message = `${exception.name}: ${exception.message}`;
    super.catch(new ConflictException(message), host);
  }
}

//__EOF__
