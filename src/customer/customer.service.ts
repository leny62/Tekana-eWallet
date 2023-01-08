import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createTransactionDto, createWalletDto, topUpDto } from "./dto";
import { Transaction, User, Wallet } from '@prisma/client';
import { transactionsInterface } from './interface';
import { Etypes } from 'src/auth/enums';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(dto: createWalletDto, user: User):Promise<Wallet> {
    const wallet = await this.prisma.wallet.create({
      data: {
        balance: 0,
        userId: user.id,
        currency: dto.currency,
        name: dto.name,
        description: dto.description,
      },
    });

    return wallet;
  }

  async getAllWallets(user: User) :Promise<Wallet[]>{
    const wallets = await this.prisma.wallet.findMany({
      where: {
        userId: user.id,
      },
    });

    return wallets;
  }

  async transferMoney(
    to: number,
    from: number,
    dto: createTransactionDto,
    me: number,
    toId: number,
  ):Promise<Transaction> {
    const toWallet = await this.prisma.wallet.findUnique({
      where: {
        id: to,
      },
    });

    const fromWallet = await this.prisma.wallet.findUnique({
      where: {
        id: from,
      },
    });

    if (toWallet.currency !== fromWallet.currency) {
      throw new ForbiddenException('Currencies do not match');
    }

    if (fromWallet.balance < dto.amount) {
      throw new ForbiddenException('Insufficient funds');
    }

    const newFromBalance = fromWallet.balance - dto.amount;
    const newToBalance = toWallet.balance + dto.amount;

    const newFromWallet = await this.prisma.wallet.update({
      where: {
        id: from,
      },
      data: {
        balance: newFromBalance,
      },
    });

    const newToWallet = await this.prisma.wallet.update({
      where: {
        id: to,
      },
      data: {
        balance: newToBalance,
      },
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: fromWallet.currency,
        walletId: from,
        fromUserId: me,
        toUserId: toId,
        type:Etypes.TRANSFER
      },
    });

    return transaction;
  }

  async viewWallet(id: number){
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: id,
      },
    });

    //     const transactions = await this.prisma
    //       .$queryRaw`SELECT "Transaction".*, "FromUser"."fullNames", "ToUser"."fullNames"
    // FROM "Transaction"
    // LEFT JOIN "User" AS "FromUser" ON "FromUser"."id" = "Transaction"."fromUserId"
    // LEFT JOIN "User" AS "ToUser" ON "ToUser"."id" = "Transaction"."toUserId"
    // WHERE "Transaction"."walletId" = ${id}`;

    // This querry is not returning the data as expected

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

  async topUpWallet(id: number, dto: topUpDto, me: number):Promise<Transaction> {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: id,
      },
    });

    if(wallet.userId!==me){
      throw new ForbiddenException('You cannot top up this wallet')
    }

    if(wallet.currency!==dto.currency){
      throw new ForbiddenException('Currency does not match')
    }


    const newBalance = wallet.balance + dto.amount;


    const newWallet = await this.prisma.wallet.update({
      where: {
        id: id,
      },
      data: {
        balance: newBalance,
      },
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        currency: wallet.currency,
        walletId: id,
        fromUserId: me,
        type:Etypes.TOPUP,
        toUserId:me
      },
    });

    return transaction;
  }
}
