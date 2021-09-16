import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsString()
  @ApiProperty({ minLength: 5, maxLength: 100 })
  templateTitle: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100 })
  templateSubject: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 5000 })
  templateBody: string;
}
