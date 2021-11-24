import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateExitPlanDto {
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  preSchool: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  dayCare: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  otherServices: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
  tpEarlyStartFamillySpecialist: string;

  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50 })
  tpEarlyStartFamillySpecialistDate: Date;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  isEligibleForKERN: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  epQuestionToParentOneAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  epQuestionToParentTwoAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  epQuestionToParentThirdAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  epQuestionToParentThirdAAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  epQuestionToParentFourthAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  epContinueStatus: string;

  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50 })
  epCompletedDate: Date;
}
