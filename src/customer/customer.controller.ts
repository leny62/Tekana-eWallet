import { Body, Controller, Get, HttpCode, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth, ApiBody,
  ApiCreatedResponse, ApiForbiddenResponse,
  ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CustomerService } from './customer.service';
import { createTransactionDto, createWalletDto, topUpDto } from "./dto";

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
  @ApiOperation({ summary: 'customer create wallet' })
  async createWallet(@Body() dto:createWalletDto,@GetUser() user:User){
    return await this.customerService.createWallet(dto,user);
  }

  @Get('get-wallets')
  @HttpCode(200)
  @ApiOkResponse({ description: 'wallets retrieved' })
  @ApiOperation({ summary: 'customer get all wallets' })
  async getAllWallets(@GetUser() user:User){
    return await this.customerService.getAllWallets(user);
  }

  @Post('create-transaction')
  @ApiCreatedResponse({ description: 'created transaction' })
  @ApiOperation({ summary: 'Transfer money' })
  @ApiBody({ type: createTransactionDto })
  @ApiQuery({ name: 'from', type: Number,description:'walletId for your wallet' })
  @ApiQuery({ name: 'to', type: Number,description:'walletId for the wallet you want to transfer to' })
  @ApiQuery({ name: 'toId', type: Number ,description:'userId for the user you want to send money'})

  @ApiForbiddenResponse({ description: 'currency do notmatch or amount is less than one on account' })
  async createTransaction(@Body() dto:createTransactionDto,@Query('to',ParseIntPipe)to:number,@Query('from',ParseIntPipe)from:number,@GetUser()user:User,@Query('toId',ParseIntPipe)toId:number){
    return await this.customerService.transferMoney(to,from,dto,user.id,toId);
  }

  @Get('view-wallet')
  @ApiOkResponse({ description: 'wallet retrieved' })
  @ApiOperation({ summary: 'View your wallet' })
  @ApiQuery({ name: 'walletId', type: Number,description:'walletId for the wallet your wallet' })
  async getWallet(@Query('walletId',ParseIntPipe)walletId:number){
    return await this.customerService.viewWallet(walletId);
    
  }

  @Post('topup-wallet')
  @ApiCreatedResponse({ description: 'topup wallet' })
  @ApiOperation({ summary: 'Top up your wallet' })
  @ApiQuery({ name: 'walletId', type: Number,description:'walletId for the wallet your wallet' })
  @ApiForbiddenResponse({ description: 'currency do notmatch or this not your  account' })
  @ApiBody({ type: topUpDto })
  async topUpWallet(@Query('walletId',ParseIntPipe)id:number,@Body()dto:topUpDto,@GetUser()user:User){
    return await this.customerService.topUpWallet(id,dto,user.id);
  }

  }
