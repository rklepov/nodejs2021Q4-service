// server.ts

import { Level as LogLevel } from 'pino';

import { LOG_DIR, LOG_LEVEL, PORT, ADDR } from './common/config';
import Logger from './common/logger';

import App from './app';

function stop(log: Logger, app: App) {
  app
    .stop()
    .then(() => {
      log.info('The server has been stopped');
    })
    .catch((e) => {
      const errMsg = e instanceof Error ? e.message : String(e);
      log.fatal(`Failed to stop the server: ${errMsg}`);
    });
}

/**
 * The main entry point of the REST server application.
 * Creates the application instance and starts the server on the specified port.
 *
 * @param port - The server port number
 */
function run(port: number, addr: string, logLevel: LogLevel, logDir: string) {
  const log = new Logger(logLevel, logDir);
  const app = new App(log);

  app
    .start(port, addr)
    .then(() => {
      log.info('The server has been started successfully');
    })
    .catch((e) => {
      const errMsg = e instanceof Error ? e.message : String(e);
      log.fatal(`Failed to start the server on ${port}: ${errMsg}`);
      process.exitCode = 1;
    });

  process.on('uncaughtException', (error, origin) => {
    log.pinoLogger.error(error);
    log.pinoLogger.fatal(
      { origin, error: error.toString() },
      'Uncaught Exception'
    );
    stop(log, app);
    process.exitCode = 126;
    // don't want to exit here, need to stop the server first, the process will
    // exit automatically after that
    // process.exit();
  });

  process.on('unhandledRejection', (reason, promise) => {
    log.pinoLogger.error(reason);
    log.pinoLogger.fatal(
      { reason: String(reason), promise: String(promise) },
      'Unhandled Rejection'
    );
    stop(log, app);
    process.exitCode = 125;
    // don't want to exit here, need to stop the server first, the process will
    // exit automatically after that
    // process.exit();
  });
}

run(
  Number(PORT) || 4000,
  ADDR || 'localhost',
  (LOG_LEVEL as LogLevel) || 'info',
  LOG_DIR || './logs'
);

// To check the unhandled exception handling uncomment the following line and
// try to start the server (increase the timeout if necessary)
//
// setTimeout(() => { throw Error('Oops! unhandled exception'); }, 1000);

// To check the unhandled rejection handling uncomment the following line and
// try to start the server (increase the timeout if necessary)
//
// setTimeout(() => { Promise.reject(Error('Oops! unhandled rejection')); }, 1000);

// __EOF__
