// main.ts

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 4000);
}

// TODO:
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

// __EOF__
