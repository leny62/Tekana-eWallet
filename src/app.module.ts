import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { CustomerModule } from './customer/customer.module';
@Module({
  imports: [AdminModule, PrismaModule, AuthModule,ConfigModule.forRoot({ isGlobal: true }), CustomerModule],
})
export class AppModule {}
