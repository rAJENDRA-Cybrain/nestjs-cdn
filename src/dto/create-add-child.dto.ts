import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateAdditionalChildrenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 5, maxLength: 50, default: '' })
  childName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ minLength: 0, maxLength: 50, default: 0 })
  childAge: number;

  @IsString()
  @IsUUID()
  @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
  intakeId: string;
}
