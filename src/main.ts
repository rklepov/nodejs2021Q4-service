// main.ts

import {
  INestApplication,
  NestApplicationOptions,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';

function createAppExpress(options?: NestApplicationOptions) {
  return NestFactory.create<NestExpressApplication>(AppModule, options);
}

function createAppFastify(options?: NestApplicationOptions) {
  return NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    options,
  );
}

function stop(logger: LoggerService, app: INestApplication) {
  app
    .close()
    .then(() => {
      logger.log('App closed');
    })
    .catch((e: Error) => {
      logger.error(`Failed to close the app: ${e.name} ${e.message}`);
    });
}

async function start(app: INestApplication) {
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  process.on('uncaughtException', (error, origin) => {
    logger.pino.fatal('Uncaught Exception', {
      origin,
      error: error.toString(),
    });
    stop(logger, app);
    process.exitCode = 125;
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.pino.fatal('Unhandled Rejection', {
      reason: String(reason),
      promise: String(promise),
    });
    stop(logger, app);
    process.exitCode = 126;
  });

  logger.log(`Running as '${app.getHttpAdapter().getType()}'`);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const port = config.get<string>('PORT', '4000');
  await app.listen(port, config.get<string>('ADDR', 'localhost'));
  logger.log(`App listening on port ${port}`);
}

async function bootstrap() {
  const config = new ConfigService();
  const useFastify = config.get<string>('USE_FASTIFY', 'false');
  const factory =
    useFastify.toLowerCase() === 'true' ? createAppFastify : createAppExpress;

  const app = await factory({
    bufferLogs: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Trello Service')
    .setDescription("Let's try to create a competitor for Trello!")
    .setVersion(`3.0 (${app.getHttpAdapter().getType()})`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);

  await start(app);
}

// TODO:
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

// __EOF__
