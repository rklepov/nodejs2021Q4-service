// config.ts

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const {
  NODE_ENV,

  PORT,
  ADDR,
  LOG_LEVEL,
  LOG_DIR,

  JWT_SECRET_KEY,
  BCRYPT_SALT_ROUNDS,
} = process.env;

// TODO: this one is actually not used anywhere
export const AUTH_MODE = process.env.AUTH_MODE === 'true';

// __EOF__
