// validate-auth.ts

import { FastifyReply, FastifyRequest } from 'fastify';
import HTTP_STATUS from 'http-status';

export async function validateAuth<Q>(q: FastifyRequest<Q>, p: FastifyReply) {
  try {
    await q.jwtVerify();
  } catch (e) {
    await p.code(HTTP_STATUS.UNAUTHORIZED).send(e);
  }
}

// __EOF__
