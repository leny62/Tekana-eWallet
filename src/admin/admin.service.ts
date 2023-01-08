import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { customerDto } from './dto';
import { ERoles } from '../auth/enums';
import * as argon from 'argon2';
import { Admin, User } from '@prisma/client';
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
    const password = await argon.hash(dto.password);
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
}
