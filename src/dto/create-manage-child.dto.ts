import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateManageChildNotesDto {
  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  conversationTypeId: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  timestamp: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 1500, default: '' })
  notes: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  intakeId: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  addedBy: string;
}
