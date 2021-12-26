// logger.ts

import path from 'path';
import { FastifyReply, FastifyRequest } from 'fastify';

import pino, { Level as LogLevel, Logger as PinoLogger } from 'pino';

/**
 * Simple logger wrapper over pino log.
 */
class Logger {
  pinoLogger: PinoLogger;

  constructor(logLevel: LogLevel, logsDir: string) {
    this.pinoLogger = pino({
      serializers: {
        req(q: FastifyRequest) {
          // log http request url, query parameters
          // (the request body is logged separately via Fastify hook)
          return {
            method: q.method,
            url: q.url,
            headers: q.headers,
            params: q.params,
            query: q.query,
          };
        },
        res(p: FastifyReply) {
          // log http response status code
          // (the response  body is logged separately via Fastify hook)
          return {
            statusCode: p.statusCode,
          };
        },
      },
      transport: {
        targets: [
          {
            // all log records go to ${LOG_DIR}/full-${PID}.log
            target: 'pino/file',
            level: logLevel,
            options: {
              destination: path.join(
                __dirname,
                '../../',
                logsDir,
                `full-${process.pid}.log`
              ),
              mkdir: true,
            },
          },
          {
            // error+ level log records additionally go to
            // ${LOG_DIR}/error-${PID}.log
            target: 'pino/file',
            level: 'error',
            options: {
              destination: path.join(
                __dirname,
                '../../',
                logsDir,
                `error-${process.pid}.log`
              ),
              mkdir: true,
            },
          },
          {
            // also logging to console in prettified format
            // TODO: colorized console logs should preferably be enabled only in
            // dev version of the app
            // https://www.fastify.io/docs/latest/Reference/Logging
            target: 'pino-pretty',
            level: logLevel,
            options: {
              destination: 1,
              colorize: true,
              translateTime: 'yyyy-mm-dd hh:MM:ss.l',
              ignore: 'pid,hostname',
            },
          },
        ],
      },
    });
  }

  info(msg: string, ...args: unknown[]) {
    this.pinoLogger.info(msg, ...args);
  }

  warn(msg: string, ...args: unknown[]) {
    this.pinoLogger.warn(msg, ...args);
  }

  error(msg: string, ...args: unknown[]) {
    this.pinoLogger.error(msg, ...args);
  }

  fatal(msg: string, ...args: unknown[]) {
    this.pinoLogger.fatal(msg, ...args);
  }

  trace(msg: string, ...args: unknown[]) {
    this.pinoLogger.trace(msg, ...args);
  }

  debug(msg: string, ...args: unknown[]) {
    this.pinoLogger.debug(msg, ...args);
  }
}

export default Logger;

// __EOF__
