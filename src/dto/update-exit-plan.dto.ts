import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateExitPlanDto {
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
