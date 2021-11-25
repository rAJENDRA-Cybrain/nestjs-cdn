import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransitionPlanDto {
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  preSchool: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  dayCare: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
  tpEarlyStartFamillySpecialist: string;

  @ApiProperty({ minLength: 0, maxLength: 50 })
  tpEarlyStartFamillySpecialistDate: Date;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  tpQuestionToParentOneAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  tpQuestionToParentTwoAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  tpQuestionToParentThirdAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  tpQuestionToParentThirdAAns: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 3, default: '' })
  tpQuestionToParentFourthAns: string;

  @ApiProperty({ minLength: 0, maxLength: 50 })
  tpCompletedDate: Date;
}
