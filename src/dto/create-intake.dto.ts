import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateIntakeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  childName: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 50, default: '' })
  childMiddleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
  childLastName: string;

  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50 })
  dateOfBirth: Date;

  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50 })
  dateOfReceived: Date;

  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50 })
  dateOfIntake: Date;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 20, default: '' })
  @IsNotEmpty()
  gender: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  preSchool: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  dayCare: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 500, default: '' })
  @IsNotEmpty()
  childDiagnosis: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  @IsNotEmpty()
  ethnicity: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  otherEthnicity: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: 'Yes' })
  @IsNotEmpty()
  fluentInEng: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  otherLang: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  otherLanguage: string;

  // parent Details
  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  @IsNotEmpty()
  parentName: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  @IsNotEmpty()
  parentLastName: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  @IsNotEmpty()
  relationshipToChild: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  parentEmail: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 200, default: '' })
  @IsNotEmpty()
  address: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 200, default: '' })
  @IsNotEmpty()
  state: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 200, default: '' })
  @IsNotEmpty()
  city: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 10, default: '' })
  @IsNotEmpty()
  zipcode: string;

  //secondary Mail Address

  @ApiPropertyOptional({ minLength: 0, maxLength: 200, default: '' })
  secondaryMailAddress: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 200, default: '' })
  secondaryMailState: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 200, default: '' })
  secondaryMailCity: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 10, default: '' })
  secondaryMailZipcode: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
  homePhnNo: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 14, default: '' })
  cellPhnNo: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 14, default: '' })
  workPhnNo: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 10, default: '' })
  @IsNotEmpty()
  isReferal: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  serviceCoordinatorId: string;

  @IsArray()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: [] })
  reasonForReferal: Array<string>;

  // Reason For Referrals
  @IsArray()
  @ApiProperty({ minLength: 0, maxLength: 100, default: [] })
  earlyStartService: Array<string>;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 500, default: '' })
  otherRelevantInformation: string;

  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  efcEmployeeId: string;
}
