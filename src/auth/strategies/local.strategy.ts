// local.strategy.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string) {
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      throw new ForbiddenException();
    }
    return user;
  }
}

// __EOF__
