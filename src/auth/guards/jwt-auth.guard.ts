// jwt-auth.guard.ts

import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (this.config.get('AUTH_MODE', 'true') === 'true') {
      return super.canActivate(context);
    }
    return true;
  }
}

// __EOF__
