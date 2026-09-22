import { afterAll, beforeAll, describe, it } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('API liveness (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication<INestApplication<Server>>();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('initializes AppModule and serves GET /health', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200, { status: 'ok' });
  });

  it('does not expose a default Hello World route', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});
