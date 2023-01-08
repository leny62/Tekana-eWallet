import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createTransactionDto, createWalletDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(dto: createWalletDto, user: User) {
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

  async getAllWallets(user: User) {
    const wallets = await this.prisma.wallet.findMany({
      where: {
        userId: user.id,
      },
    });

    return wallets;
  }

  async transferMoney(to: number, from: number, dto: createTransactionDto,me:number,toId:number) {
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
      },
    });

    return transaction;
  }

  async viewWallet(id: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: id,
      },
    });

    // raw query to  select from transaction where walletId = id left join user on user.id = transaction.fromUserId and user.id = transaction.toUserId
    const transactions = await this.prisma.$queryRaw
      `SELECT * FROM "transaction" WHERE "walletId" = ${id} LEFT JOIN "user" ON "user"."id" = "transaction"."fromUserId" OR "user"."id" = "transaction"."toUserId"`
    



    return {wallet,transactions};
  }
}
