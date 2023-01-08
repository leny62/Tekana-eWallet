import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createWalletDto } from './dto';
import { User } from "@prisma/client";

@Injectable()
export class CustomerService {
    constructor(private readonly prisma:PrismaService){}


    async createWallet(dto:createWalletDto,user:User){
        
        const wallet = await this.prisma.wallet.create({
            data:{
                balance:0,
                userId:user.id,
                currency:dto.currency,
                name:dto.name,
                description:dto.description
            }
        })

        return wallet;
    }

    async getAllWallets(user:User){
        const wallets = await this.prisma.wallet.findMany({
            where:{
                userId:user.id
            }
        })

        return wallets;
    }
}