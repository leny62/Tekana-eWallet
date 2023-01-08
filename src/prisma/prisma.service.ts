import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ERoles } from '../auth/enums';
import * as bcrypt from 'bcryptjs';

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
          password: await bcrypt.hash('password', 10),
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

    const customer2 = await this.customers.create({
      data: {
        fullNames: 'John Doe',
        phone: 788888881,
      },
    });

    const user = await this.user.create({
      data: {
        fullNames: 'Leny Pascal IHIRWE',
        phone: 788888888,
        role: ERoles.CUSTOMER,
        password: await bcrypt.hash('password', 10),
        userId: customer.id,
      },
    });
    const user2 = await this.user.create({
      data: {
        fullNames: 'John Doe',
        phone: 788888881,
        role: ERoles.CUSTOMER,
        password: await bcrypt.hash('password', 10),
        userId: customer2.id,
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

    const wallet2 = await this.wallet.create({
      data: {
        balance: 6000,
        currency: 'RWF',
        name: 'My wallet',
        description: 'My wallet',
        userId: user2.id,
      },
    });

    const Transaction = await this.transaction.create({
      data: {
        amount: 2000,
        currency: 'RWF',
        walletId: wallet.id,
        fromUserId: user.id,
        toUserId: user.id,
        type: 'TOP UP',
      },
    });
    const TransferTransaction = await this.transaction.create({
      data: {
        amount: 5000,
        currency: 'RWF',
        walletId: wallet.id,
        fromUserId: user.id,
        toUserId: user2.id,
        type: 'Transfer',
      },
    });
    console.log(`Seeding finished.`);
  }
}
