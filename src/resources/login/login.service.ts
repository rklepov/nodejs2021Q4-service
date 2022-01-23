// login.service.ts

import HTTP_STATUS from 'http-status';

import Logger from '../../common/logger';
import { Server } from '../../common/types';
import { checkPassword, reply } from '../../common/utils';

import { DatabaseConnection } from '../../db/database';

import LoginRepo from './login.repo';
import { LoginRequest } from './login.types';

class LoginService {
  /**
   * Logger instance.
   */
  log: Logger;

  /**
   * "Login" repository which is used to get the stored user data by login.
   */
  repo: LoginRepo;

  /**
   * fastify-jwt interface for working with JavaScript Web Token
   */
  fastify: Server;

  constructor(log: Logger, db: DatabaseConnection, server: Server) {
    this.log = log;
    this.repo = new LoginRepo(db);
    this.fastify = server;
  }

  async auth({ body }: LoginRequest) {
    const { login, password } = body;
    const user = await this.repo.getByLogin(login);

    if (!user) {
      this.log.warn(
        `[LoginService::auth] User with login '${login}' not found`
      );

      return reply(HTTP_STATUS.FORBIDDEN);
    }

    if (!(await checkPassword(password, user.password))) {
      this.log.warn(
        `[LoginService::auth] Wrong password for the user '${login}'`
      );

      return reply(HTTP_STATUS.FORBIDDEN);
    }

    return reply(HTTP_STATUS.OK, {
      token: this.fastify.jwt.sign(
        { userId: user.userId, login },
        { expiresIn: '60s' }
      ),
    });
  }
}

export default LoginService;

// __EOF__
