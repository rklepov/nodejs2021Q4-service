// user.types.ts

import { FastifyRequest } from 'fastify';

import { UUIDString } from '../../common/utils';

/**
 * The unique **Id** of the user.
 */
export type UserId = UUIDString;

/**
 * An abstraction of the object having **userId** property (request message and
 * {@link User} class)
 */
export interface IUserId {
  userId: UserId;
}

/**
 * An abstraction of the **User** object.
 */
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
