// login.repo.ts

import { DatabaseConnection, UsersTable } from '../../db/database';

import User from '../users/user.model';

import { ILogin } from './login.types';

class LoginRepo {
  users: UsersTable;

  constructor(db: DatabaseConnection) {
    this.users = db.getRepository(User);
  }

  async getByLogin(login: ILogin['login']) {
    const user = await this.users.findOne({ login });
    return user ?? null;
  }
}

export default LoginRepo;

// __EOF__
