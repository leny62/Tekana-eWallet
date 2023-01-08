import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ERoles } from '../auth/enums';
import * as argon from 'argon2';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  async seed() {
    console.log('start seeding...');
    if ((await this.admin.count({ where: { role: ERoles.ADMIN } })) < 1) {
      await this.admin.create({
        data: {
          fullNames: 'Leny Pascal IHIRWE',
          password: await argon.hash('password'),
          role: ERoles.ADMIN,
          phone: 788888888,
        },
      });
    }
    await this.customers.create({
      data: {
        fullNames: 'Leny Pascal IHIRWE',
        phone: 788888888,
      },
    });
    console.log(`Seeding finished.`);
  }
}
