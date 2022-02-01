// main.ts

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 4000);
}

// TODO:
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

// __EOF__
