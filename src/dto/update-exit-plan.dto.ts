import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateExitPlanDto {
  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  epContinueStatus: string;

  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50 })
  epCompletedDate: Date;
}
