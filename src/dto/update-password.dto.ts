import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({
    minLength: 5,
    maxLength: 50,
    default: 'Super-Admin',
  })
  source: string;

  @IsString()
  @MinLength(8)
  @ApiPropertyOptional({ minLength: 0, default: '' })
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, default: '' })
  newPassword: string;
}

export class ForcePasswordDto {
  @IsString()
  @ApiProperty({
    minLength: 5,
    maxLength: 50,
    default: 'FCP',
  })
  source: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, default: '' })
  newPassword: string;
}
