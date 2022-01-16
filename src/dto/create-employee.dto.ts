import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

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

export class Format {
  @ApiProperty({ default: '' })
  @IsUUID()
  intakeId: string;

  @ApiProperty({ default: '' })
  @IsUUID()
  efcEmployeeId: string;
}
export class BulkReAssignIntakes {
  @ApiProperty({ default: '' })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: Format, isArray: true })
  @IsArray()
  reassignChilds: Array<Format>;
}
