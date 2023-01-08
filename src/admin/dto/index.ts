import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class customerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'fullName',
    required: true,
    default: 'John2 Doe',
  })
  fullNames: string;
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
