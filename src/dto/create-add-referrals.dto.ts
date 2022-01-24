import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReferralsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50, default: '' })
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

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  parentSecondaryEmail: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 14, default: '' })
  @IsNotEmpty()
  homePhnNo: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 14, default: '' })
  cellPhnNo: string;

  @IsString()
  @ApiPropertyOptional({ minLength: 0, maxLength: 14, default: '' })
  workPhnNo: string;

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

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 200, default: '' })
  @IsNotEmpty()
  address: string;

  //secondary Mail Address

  @ApiPropertyOptional({ minLength: 0, maxLength: 200, default: '' })
  secondaryMailAddress: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 200, default: '' })
  secondaryMailState: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 200, default: '' })
  secondaryMailCity: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 10, default: '' })
  secondaryMailZipcode: string;

  // Reason For Referrals
  @IsArray()
  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: [] })
  reasonForReferal: Array<string>;

  // Allocate Efc Employee & Referral Source
  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  efcEmployeeId: string;

  @IsString()
  @ApiProperty({ minLength: 0, maxLength: 10, default: '' })
  @IsNotEmpty()
  isReferal: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: '' })
  serviceCoordinatorId: string;

  @ApiPropertyOptional({ default: '' })
  welcomeEmailContent: string;

  @ApiPropertyOptional({ default: '' })
  welcomeEmailSubject: string;

  @ApiPropertyOptional({ minLength: 0, maxLength: 100, default: [] })
  welcomeEmailAttachments: Array<string>;

  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  addedBy: string;

  @IsNotEmpty()
  @ApiProperty({ default: false })
  isForced: boolean;
}
