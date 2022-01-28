// login.model.ts

class Login {
  static schema = {
    tags: ['login'],

    params: {
      type: 'object',
      additionalProperties: false,
    },

    request: {
      type: 'object',
      required: ['login', 'password'],
      properties: {
        login: { type: 'string' },
        password: { type: 'string' },
      },
    },

    response: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  };
}

export default Login;

// __EOF__
