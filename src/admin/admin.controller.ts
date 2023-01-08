import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {  customerDto } from './dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { AllowRoles } from '../auth/decorators';
import { ERoles } from '../auth/enums';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.ADMIN)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-customer')
  @ApiBody({ type: customerDto })
  @ApiOperation({ summary: 'create customer' })
  @ApiCreatedResponse({ description: 'Customer created successfully' })
  @ApiConflictResponse({ description: 'Customer already exists' })
  async createCustomer(@Body() dto: customerDto) {
    return this.adminService.createCustomer(dto);
  }

  @Get('get-customers')
  @ApiOperation({ summary: 'get all customers' })
  @ApiOkResponse({ description: 'customers retrieved successfully' })
  async getCustomers() {
    return this.adminService.viewCustomers();
  }

  @Get('wallet-transactions')
  @ApiOperation({ summary: 'get all transactions for wallet' })
  @ApiOkResponse({ description: 'transactions retrieved successfully' })
  @ApiQuery({
    name: 'walletId',
    type: Number,
    description: 'walletId for the wallet User wallet',
  })
  async getWalletTransactions(@Query('walletId', ParseIntPipe) id: number) {
    return this.adminService.viewCustomerWallet(id);
  }
}
