import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AdminDto, AdminLoginDto, CustomerLoginDto } from './dto';
import { Admin } from '@prisma/client';
import { ERoles } from './enums';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateToken(
    userId: number,
    fullNames: string,
    role: string,
    id: number,
    phone: number,
  ): {
    data: {
      userId: number;
      fullNames: string;
      role: string;
      id: number;
      phone: number;
    };
    token: string;
  } {
    const token = this.Jwt.sign(
      { userId, phone, fullNames, role, id },
      { secret: this.config.get('JWT_SECRET') },
    );
    return {
      data: {
        userId,
        phone,
        fullNames,
        role,
        id,
      },
      token,
    };
  }

  async createAdmin(dto: AdminDto):Promise<Admin> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        phone: dto.phone,
      },
    });
    if (admin) {
      throw new ConflictException('Admin already exist');
    }

    const password = await bcrypt.hash(dto.password,10);

    const newAdmin = await this.prisma.admin.create({
      data: {
        fullNames: dto.fullNames,
        phone: dto.phone,
        role: ERoles.ADMIN,
        password,
      },
    });

    return newAdmin;
  }

  async AdminLogin(dto: AdminLoginDto): Promise<{}> {
    const admin = await this.prisma.admin.findFirst({
      where: { phone: dto.phone },
    });

    if (!admin) {
      throw new NotFoundException('Admin does not exist');
    } else if (!(await bcrypt.compare(admin.password, dto.password))) {
      throw new ForbiddenException('Wrong Admin password');
    } else {
      return this.generateToken(
        admin.id,
        admin.fullNames,
        admin.role,
        admin.id,
        admin.phone,
      );
    }
  }

async  customerLogin(dto:CustomerLoginDto){
  const customer = await this.prisma.user.findFirst({
    where: { phone: dto.phone },
  });

  if (!customer) {
    throw new NotFoundException('customer does not exist');
  } else if (!(await bcrypt.compare(customer.password, dto.password))) {
    throw new ForbiddenException('Wrong customer password');
  } else {
    return this.generateToken(
      customer.id,
      customer.fullNames,
      customer.role,
      customer.id,
      customer.phone,
    );
  }
}
  


}
