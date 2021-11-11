import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  firstName: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
  lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  emailId: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, default: '' })
  password: string;

  @ApiProperty({ default: '' })
  @IsUUID()
  roleId: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  emailId: string;
}

//   @IsString()
//   @IsEmpty()
//   // @Matches(/^\+[1-9]\d{1,14}$/)
//   @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
//   contactNo: string;

//   @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
//   dateOfJoining: Date;

//   @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
//   userName: string;
