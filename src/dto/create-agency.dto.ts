import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 250, default: '' })
  agencyName: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 550, default: '' })
  description: string;
}
