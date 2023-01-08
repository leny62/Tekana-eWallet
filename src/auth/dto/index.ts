import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    format: 'phone',
    required: true,
    default: 123456789,
  })
  phone: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'password',
    required: true,
    default: 'password',
  })
  password: string;
}

export class CustomerLoginDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    format: 'phone',
    required: true,
    default: 12349999,
  })
  phone: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'password',
    required: true,
    default: 'password',
  })
  password: string;
}
