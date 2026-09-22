import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { parsePort } from './port.js';

async function bootstrap(): Promise<void> {
  const port = parsePort(process.env.PORT);
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  try {
    await app.listen(port, '0.0.0.0');
  } catch (error) {
    await app.close();
    throw error;
  }
}

bootstrap().catch((error: unknown) => {
  Logger.error(error instanceof Error ? error.message : 'API startup failed', 'Bootstrap');
  process.exitCode = 1;
});
