import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ minLength: 5, maxLength: 50 })
  role: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100 })
  description: string;
}
