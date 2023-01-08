import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CustomerService } from './customer.service';
import { createWalletDto } from './dto';

@Controller('customer')
@ApiTags('customer')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.CUSTOMER)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create-wallet')
  @ApiCreatedResponse({ description: 'created wallet' })
  async createWallet(@Body() dto:createWalletDto,@GetUser() user:User){
    return await this.customerService.createWallet(dto,user);
  }

  @Get('get-wallets')
  @HttpCode(200)
  @ApiOkResponse({ description: 'wallets retrieved' })
  async getAllWallets(@GetUser() user:User){
    return await this.customerService.getAllWallets(user);
  }

  }
