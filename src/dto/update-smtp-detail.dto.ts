import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateSmtpDetailDto } from './create-smtp-detail.dto';

export class UpdateSmtpDetailDto extends PartialType(CreateSmtpDetailDto) {}

export class UpdateSmtpDetailStatusDto {
  @IsBoolean()
  @ApiProperty({ minLength: 0, maxLength: 10, default: false })
  isActive: boolean;

  @IsBoolean()
  @ApiProperty({ minLength: 0, maxLength: 10, default: false })
  isDelete: boolean;
}
