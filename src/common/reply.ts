// reply.ts

export function reply<PayloadT>(status: number, payload?: PayloadT) {
  return { status, payload };
}

// __EOF__
