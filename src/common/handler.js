// handler.js

exports.defineHandler = (router, f) => async (q, p) => {
  const { status, payload } = await router.service[f](q);
  p.code(status).send(payload);
};

// __EOF__
