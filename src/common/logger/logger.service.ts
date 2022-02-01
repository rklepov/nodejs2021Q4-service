// logger.service.ts

import { Inject, Injectable } from '@nestjs/common';
import * as nestjsPino from 'nestjs-pino';

@Injectable()
export class LoggerService extends nestjsPino.Logger {
  constructor(
    logger: nestjsPino.PinoLogger,
    @Inject(nestjsPino.PARAMS_PROVIDER_TOKEN) params: nestjsPino.Params,
  ) {
    super(logger, params);
  }
}

// __EOF__
