import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, Length } from 'class-validator';

export class CreateServiceCoordinatorDto {
  @IsString()
  @Length(0, 100)
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  name: string;

  @IsString()
  @Length(0, 100)
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  agency: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
  phoneNo: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  emailId: string;
}
