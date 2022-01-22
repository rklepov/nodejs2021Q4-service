// login.types.ts

import { FastifyRequest } from 'fastify';

export interface ILogin {
  login: string;
  password: string;
}

export type LoginRequest = FastifyRequest<{ Body: ILogin }>;

// __EOF__
