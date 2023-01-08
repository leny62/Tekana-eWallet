import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class createWalletDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        default: 'baho',
      })
    name   :string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        default: 'RWF',
    })
    currency  :string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        default: 'baho account',
    })
    description  :string
}