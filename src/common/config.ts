// config.ts

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const {
  PORT,
  ADDR,
  NODE_ENV,
  MONGO_CONNECTION_STRING,
  JWT_SECRET_KEY,
  LOG_LEVEL,
  LOG_DIR,
} = process.env;

export const AUTH_MODE = process.env.AUTH_MODE === 'true';

// __EOF__
