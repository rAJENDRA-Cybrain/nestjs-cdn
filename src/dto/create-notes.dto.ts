import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNotesDto {
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
  @IsNotEmpty()
  // @Matches(/^\+[1-9]\d{1,14}$/)
  @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
  contactNo: string;

  @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
  dateOfJoining: Date;

  @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @ApiProperty({ minLength: 8, maxLength: 12, default: '' })
  password: string;

  @ApiProperty({ default: '' })
  @IsUUID()
  roleId: string;
}
