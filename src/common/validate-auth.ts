// validate-auth.ts

import HTTP_STATUS from 'http-status';

import { FastifyRequest, FastifyReply } from 'fastify';

export async function validateAuth<Q>(q: FastifyRequest<Q>, p: FastifyReply) {
  try {
    await q.jwtVerify();
  } catch (e) {
    await p.code(HTTP_STATUS.UNAUTHORIZED).send(e);
  }
}

// __EOF__
