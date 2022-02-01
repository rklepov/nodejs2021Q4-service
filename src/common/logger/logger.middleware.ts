// logger.middleware.ts

import { IncomingMessage, ServerResponse } from 'http';

import { Injectable, NestMiddleware } from '@nestjs/common';

// TODO: so far unused
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // eslint-disable-next-line class-methods-use-this
  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    // ! not really used anyhow for now, will keep for just in case
    next();
  }
}

// __EOF__
