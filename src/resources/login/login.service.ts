// login.service.ts

import HTTP_STATUS from 'http-status';

import Logger from '../../common/logger';
import { checkPassword, reply } from '../../common/utils';

import { DatabaseConnection } from '../../db/database';

import { LoginRequest } from './login.types';
import LoginRepo from './login.repo';

class LoginService {
  /**
   * Logger instance.
   */
  log: Logger;

  /**
   * "Login" repository which is used to get the stored user data by login.
   */
  repo: LoginRepo;

  constructor(log: Logger, db: DatabaseConnection) {
    this.log = log;
    this.repo = new LoginRepo(db);
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

    return reply(HTTP_STATUS.OK, { token: 'token' }); // TODO
  }
}

export default LoginService;

// __EOF__
