/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString,  } from 'class-validator';

export class SignInDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 100 })
  auth_key: string;

  @ApiProperty()
  @IsNotEmpty()
  auth_credentials: string;
}
