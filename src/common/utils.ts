// utils.ts

import * as uuid from 'uuid';

export function reply<PayloadT>(status: number, payload?: PayloadT) {
  return { status, payload };
}

export function genId() {
  return uuid.v4();
}

// __EOF__
