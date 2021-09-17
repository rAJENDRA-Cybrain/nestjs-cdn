import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class TriggerEmailDto {
  @IsString()
  @ApiPropertyOptional({ minLength: 5, maxLength: 100 })
  templateId: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100 })
  templateSubject: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 5000 })
  templateBody: string;

  @ApiPropertyOptional({ default: [] })
  templateAttachments: Array<any>;

  @ApiPropertyOptional({ default: [] })
  intakes: Array<any>;
}
