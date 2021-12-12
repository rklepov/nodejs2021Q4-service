// handler.js

export function defineHandler(router, f) {
  return async (q, p) => {
    const { status, payload } = await router.service[f](q);
    p.code(status).send(payload);
  };
}

// __EOF__
