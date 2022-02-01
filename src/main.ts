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
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

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

async function start(app: INestApplication) {
  const logger = app.get(Logger);
  app.useLogger(logger);
  logger.log(`Running as '${app.getHttpAdapter().getType()}'`);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const configService = app.get(ConfigService);
  await app.listen(
    configService.get<string>('PORT') || 4000,
    configService.get<string>('ADDR') || 'localhost',
  );
}

async function bootstrap() {
  const config = new ConfigService();
  const useFastify = config.get<string>('USE_FASTIFY') || 'false';
  const factory =
    useFastify.toLowerCase() === 'true' ? createAppFastify : createAppExpress;

  const app = await factory({
    bufferLogs: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Trello Service')
    .setDescription("Let's try to create a competitor for Trello!")
    .setVersion('3.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);

  await start(app);
}

// TODO:
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

// __EOF__
