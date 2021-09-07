import { PartialType } from '@nestjs/swagger';
import { CreateReferalAgencyDto } from './create-referal-agency.dto';

export class UpdateReferalAgencyDto extends PartialType(
  CreateReferalAgencyDto,
) {}
