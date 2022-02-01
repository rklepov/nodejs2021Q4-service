// logger.middleware.ts

import { Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

// TODO: so far unused
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // eslint-disable-next-line class-methods-use-this
  use(req: Request, res: Response, next: () => void) {
    // ! not really used anyhow for now, will keep for just in case
    next();
  }
}

// __EOF__
