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
    const customer = await this.customers.create({
      data: {
        fullNames: 'Leny Pascal IHIRWE',
        phone: 788888888,
      },
    });
    const user = await this.user.create({
      data: {
        fullNames: 'Leny Pascal IHIRWE',
        phone: 788888888,
        role: ERoles.CUSTOMER,
        password: await argon.hash('password'),
        userId: customer.id,
      },
    });
    const wallet = await this.wallet.create({
      data: {
        balance: 2000,
        currency: 'RWF',
        name: 'My wallet',
        description: 'My wallet',
        userId: user.id,
      },
    });
    console.log(`Seeding finished.`);
  }
}
