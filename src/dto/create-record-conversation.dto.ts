import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateRecordConversationDto {
  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  conversationTypeId: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100 })
  conversationDate: Date;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  conversationTimestamp: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 1500, default: '' })
  conversationDescriptions: string;
}
