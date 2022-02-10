// logger.interceptor.ts

import pick from 'lodash.pick';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NestRequest, NestResponse } from '../types';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  // TODO: the requests that are cut early (400 etc.) don't get here for some
  //       reason
  intercept(context: ExecutionContext, next: CallHandler) {
    // *  request url and body are available at this point for Fastify
    const request: NestRequest = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const req = pick(request, [
      'id',
      'method',
      'url',
      'hostname',
      'headers',
      'params',
      'query',
      'body',
    ]);

    const reply: NestResponse = context.switchToHttp().getResponse();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = pick(reply, 'statusCode');

    // TODO: i'm still thinking about how fastify request body can be added to
    // the regular pino logging pipeline (configured via serializers property)

    // this.logger.pino.assign({ req, res,
    // responseTime: ???
    // });
    // this.logger.pino.info('request completed');

    return next.handle();
  }
}

// __EOF__
