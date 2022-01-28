// server.ts

import { Level as LogLevel } from 'pino';

import { ADDR, LOG_DIR, LOG_LEVEL, PORT } from './common/config';
import { ApplicationException } from './common/except';
import Logger from './common/logger';

import { createDatabaseConnection } from './db/database';

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
  const start = async (log: Logger) => {
    try {
      const databaseConnection = await createDatabaseConnection(log);
      log.info('The database connection has been established successfully');

      const app = new App(log, databaseConnection);
      await app.start(port, addr);

      process.on('uncaughtException', (error, origin) => {
        log.pinoLogger.error(error);
        log.pinoLogger.fatal(
          { origin, error: error.toString() },
          'Uncaught Exception'
        );
        stop(log, app);
        process.exitCode = ApplicationException.UNHANDLED_EXCEPTION;
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
        process.exitCode = ApplicationException.UNHANDLED_REJECTION;
        // don't want to exit here, need to stop the server first, the process will
        // exit automatically after that
        // process.exit();
      });
    } catch (e) {
      if (e instanceof ApplicationException) {
        throw e;
      } else if (e instanceof Error) {
        throw new ApplicationException(
          `root cause: [${e.name}] ${e.message}`,
          ApplicationException.GENERAL_APPLICATION_ERROR
        );
      } else {
        throw new ApplicationException(
          `unexpected error: ${String(e)}`,
          ApplicationException.UNEXPECTED
        );
      }
    }
  };

  const log = new Logger(logLevel, logDir);

  start(log)
    .then(() => {
      log.info('The server has been started successfully');
    })
    .catch((e) => {
      if (e instanceof ApplicationException) {
        log.fatal(`[${e.name}]: ${e.message}`);
        process.exitCode = e.statusCode;
      } else {
        log.fatal(`[UNEXPECTED ERROR] ${String(e)}`);
        process.exit(ApplicationException.UNEXPECTED);
      }
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
