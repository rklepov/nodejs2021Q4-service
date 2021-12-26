// server.ts

import { Level as LogLevel } from 'pino';

import { LOG_DIR, LOG_LEVEL, PORT } from './common/config';
import Logger from './common/logger';

import App from './app';

/**
 * The main entry point of the REST server application.
 * Creates the application instance and starts the server on the specified port.
 *
 * @param port - The server port number
 */
function run(port: number, logLevel: LogLevel, logDir: string) {
  const logger = new Logger(logLevel, logDir);
  const app = new App(logger);
  app
    .start(port)
    .then(() => {
      logger.info('The server has been started successfully');
    })
    .catch((e) => {
      const errMsg = e instanceof Error ? e.message : String(e);
      logger.fatal(`Failed to start the server on ${port}: ${errMsg}`);
    });
}

run(
  Number(PORT) || 4000,
  (LOG_LEVEL as LogLevel) || 'info',
  LOG_DIR || './logs'
);

// __EOF__
