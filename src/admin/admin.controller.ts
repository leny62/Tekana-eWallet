import { Controller, Post,Body,UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import {AdminDto, customerDto} from "./dto";
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";

import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.ADMIN)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
export class AdminController {
  constructor(private  readonly adminService:AdminService) {}

  @Post('create-customer')
  @ApiBody({type:customerDto})
  @ApiOperation({summary:'create customer'})
  @ApiCreatedResponse({description:'Customer created successfully'})
  @ApiConflictResponse({description:'Customer already exists'})
  async createCustomer(@Body()dto:customerDto){
    return this.adminService.createCustomer(dto)
  }

}
