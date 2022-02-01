// logger.module.ts

import dayjs from 'dayjs';
import path from 'path';
import * as pino from 'pino';

import { Request, Response } from 'express';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as NestjsPinoLoggerModule } from 'nestjs-pino';

import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    NestjsPinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const timestamp = dayjs().format('YYYYMMDDHHmmss');
        const logLevel = config.get('LOG_LEVEL') as pino.Level;
        const logsDir = config.get<string>('LOG_DIR') || './logs';

        return {
          pinoHttp: {
            level: logLevel,
            useLevelLabels: true,

            serializers: {
              req(q: Request) {
                // log http request url, query parameters
                return {
                  id: q.id,
                  method: q.method,
                  url: q.url,
                  headers: q.headers,
                  params: q.params,
                  query: q.query,
                };
              },
              res(p: Response) {
                // log http response status code
                return {
                  statusCode: p.statusCode,
                };
              },
            },
            redact: ['*.password', 'req.headers.authorization'],
            transport: {
              targets: [
                {
                  // all log records go to ${LOG_DIR}/full-{YYYYMMDDHHmmss}-${PID}.log
                  target: 'pino/file',
                  level: logLevel,
                  options: {
                    destination: path.join(
                      __dirname,
                      '../../../',
                      logsDir,
                      `full-${timestamp}-${process.pid}.log`,
                    ),
                    mkdir: true,
                  },
                },
                {
                  // error+ level log records additionally go to
                  // ${LOG_DIR}/error-{YYYYMMDDHHmmss}-${PID}.log
                  target: 'pino/file',
                  level: 'error',
                  options: {
                    destination: path.join(
                      __dirname,
                      '../../../',
                      logsDir,
                      `error-${timestamp}-${process.pid}.log`,
                    ),
                    mkdir: true,
                  },
                },
                {
                  // also logging to console in prettified format
                  // TODO: colorized console logs should preferably be enabled
                  // only in dev version of the app
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
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}

// __EOF__
