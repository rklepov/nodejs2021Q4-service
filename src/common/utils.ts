// utils.ts

import * as uuid from 'uuid';

/**
 * A small utility function used for returning the result of the processing of
 * an HTTP request by a service. The result is subsequently passed to the server
 * reply.
 *
 * @param status - HTTP status of the request
 * @param payload - The body of the HTTP response (can differ depending on the
 * actual request type)
 *
 * @see {@link https://www.npmjs.com/package/http-status | http-status  -  npm}
 *
 * @returns The \{ status, payload \} pair which will eventually be passed to
 * the server reply
 */
export function reply<PayloadT>(status: number, payload?: PayloadT) {
  return { status, payload };
}

/**
 * The string representation of {@link https://www.ietf.org/rfc/rfc4122.txt | RFC4122} UUID.
 */
type UUIDString = ReturnType<typeof uuid.v4>;

/**
 * Generates the unique object Id as a version 4 (random) UUID.
 *
 * @see {@link https://www.npmjs.com/package/uuid | uuid  -  npm}
 *
 * @returns The string representation of the generated UUID
 */
export function genId(): UUIDString {
  return uuid.v4();
}

// __EOF__