import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, Length } from 'class-validator';

export class CreateReferalAgencyDto {
  @IsString()
  @Length(0, 100)
  @ApiProperty({ minLength: 0, maxLength: 100 })
  name: string;

  @IsString()
  @Length(0, 100)
  @ApiProperty({ minLength: 0, maxLength: 100 })
  agency: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 14 })
  phoneNo: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ minLength: 0, maxLength: 100 })
  emailId: string;
}
