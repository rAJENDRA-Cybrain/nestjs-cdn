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
  @MaxLength(12)
  @ApiPropertyOptional({ minLength: 0, maxLength: 12, default: '' })
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @ApiProperty({ minLength: 8, maxLength: 12, default: '' })
  newPassword: string;
}
