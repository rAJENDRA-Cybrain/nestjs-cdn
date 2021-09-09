import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationTypeDto {
  @IsString()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  type: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  description: string;
}
