// logger.service.ts

import { Inject, Injectable } from '@nestjs/common';
import * as nestjsPino from 'nestjs-pino';

@Injectable()
export class LoggerService extends nestjsPino.PinoLogger {
  constructor(
    @Inject(nestjsPino.PARAMS_PROVIDER_TOKEN) params: nestjsPino.Params,
  ) {
    super(params);
  }
}

// __EOF__
