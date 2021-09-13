import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSmtpDetailDto {
  @IsString()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  smtpUserName: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  smtpPassword: string;

  @IsNumber()
  @ApiProperty({ minLength: 0, maxLength: 100, default: 0 })
  smtpPort: number;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  smtpHost: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  smtpDisplayName: string;

  @IsBoolean()
  @ApiProperty({ minLength: 0, maxLength: 100, default: false })
  smtpSsl: boolean;
}
