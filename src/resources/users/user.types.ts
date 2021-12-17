// user.types.ts

import { FastifyRequest } from 'fastify';

import { genId } from '../../common/utils';

export type UserId = ReturnType<typeof genId>;

export interface IUserId {
  userId: UserId;
}
export interface IUser {
  name: string;
  login?: string;
  password?: string;
}

export type UserGetRequest = FastifyRequest<{ Params: IUserId }>;
export type UserPostRequest = FastifyRequest<{ Body: IUser }>;
export type UserPutRequest = FastifyRequest<{ Params: IUserId; Body: IUser }>;
export type UserDeleteRequest = FastifyRequest<{ Params: IUserId }>;

// __EOF__
