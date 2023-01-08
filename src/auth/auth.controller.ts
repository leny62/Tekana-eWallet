import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto, CustomerLoginDto } from './dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminDto } from 'src/admin/dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-admin')
  @ApiBody({ type: AdminDto })
  @ApiOperation({ summary: 'register admin' })
  @ApiCreatedResponse({ description: 'Admin created successfully' })
  @ApiConflictResponse({ description: 'Admin already exists' })
  async registerAdmin(@Body() dto: AdminDto) {
    return this.authService.createAdmin(dto);
  }

  @Post('admin-login')
  @HttpCode(200)
  @ApiBody({ type: AdminLoginDto })
  @ApiOperation({ summary: 'Admin Login' })
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiForbiddenResponse({ description: 'Wrong Password' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    const result = await this.authService.AdminLogin(dto);
    return result;
  }

  @Post('customer-login')
  @HttpCode(200)
  @ApiBody({ type: CustomerLoginDto })
  @ApiOperation({ summary: 'Customer Login' })
  @ApiOkResponse({ description: 'Customer Created Successfully' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiForbiddenResponse({ description: 'Wrong Password' })
  async customerLogin(@Body() dto: CustomerLoginDto) {
    const result = await this.authService.customerLogin(dto);
    return result;
  }
}
