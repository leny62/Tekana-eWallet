import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { customerDto } from './dto';
import { ERoles } from '../auth/enums';
import * as bcrypt from 'bcryptjs';

import {  User } from '@prisma/client';
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(dto: customerDto): Promise<User> {
    const customer = await this.prisma.customers.findFirst({
      where: {
        phone: dto.phone,
      },
    });
    if (customer) {
      throw new ConflictException('Customer already exist');
    }
    const password = await bcrypt.hash(dto.password,10);
    const newCustomer = await this.prisma.customers.create({
      data: {
        fullNames: dto.fullNames,
        phone: dto.phone,
      },
    });
    if (newCustomer) {
      const user = await this.prisma.user.create({
        data: {
          password,
          role: ERoles.CUSTOMER,
          userId: newCustomer.id,
          fullNames: newCustomer.fullNames,
          phone: newCustomer.phone,
        },
      });
      return user;
    }
  }

  async viewCustomers(): Promise<User[]> {
    const customers = await this.prisma.user.findMany({
      where: {
        role: ERoles.CUSTOMER,
      },
      include:{
        Wallet: true,
      }
    });
    return customers;
  }

  async viewCustomerWallet(id: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: id,
      },
    });


    const t = await this.prisma.transaction.findMany({
      where: {
        walletId: id,
      },
    });

    const fromUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: t.map((transaction) => transaction.fromUserId),
        },
      },
    });

    const toUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: t.map((transaction) => transaction.toUserId),
        },
      },
    });

    const transactionsy = t.map((transaction) => {
      const fromUser = fromUsers.find(
        (user) => user.id === transaction.fromUserId,
      );
      const toUser = toUsers.find((user) => user.id === transaction.toUserId);
      return {
        ...transaction,
        fromUser: fromUser,
        toUser: toUser,
      };
    });

    return {
      wallet,
      transactions: transactionsy,
    };
  }

}
