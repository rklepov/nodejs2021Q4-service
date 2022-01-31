// auth.service.ts

import { compare } from 'bcryptjs';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.usersService.findByLogin(login);
    if (user && (await compare(pass, user.password))) {
      return { userId: user.userId, login };
    }
    return null;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const payload = await this.validateUser(
      loginAuthDto.login,
      loginAuthDto.password,
    );

    if (payload) {
      return { token: this.jwtService.sign(payload) };
    }

    throw new ForbiddenException();
  }
}

// __EOF__
