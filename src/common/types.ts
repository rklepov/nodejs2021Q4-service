// types.ts

// don't want to install express and fastify explicitly for type defs only
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastifyReply, FastifyRequest } from 'fastify';

export type UUIDString = string;

export const UUIDApiPropertyName = 'UUID';

export type NestRequest = ExpressRequest | FastifyRequest;
export type NestResponse = ExpressResponse | FastifyReply;

// __EOF__
