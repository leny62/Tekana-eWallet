import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import * as request from 'supertest';
import { initializeTestApp } from './utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    console.log(process.env.NODE_ENV);
    console.log(process.env.DATABASE_URL);
    app = await initializeTestApp();
    await app.init();
  });

  afterAll(async () => {
    const prisma = new PrismaClient();
    await prisma.$disconnect();
    await app.close();
  });

  it('should register admin', async (done) => {
    const res = await request(app.getHttpServer())
      .post('auth/register-admin')
      .send({
        FullNames: 'Leny Pascal IHIRWE',
        phone: '+0780000734',
        password: 'password',
      })
      .set('Content-Type', 'application/json');
    expect(res.status).toEqual(HttpStatus.CREATED);
    done();
  });
});
