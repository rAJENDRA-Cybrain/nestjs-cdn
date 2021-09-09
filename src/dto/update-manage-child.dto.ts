import { PartialType } from '@nestjs/swagger';
import { CreateManageChildNotesDto } from './create-manage-child.dto';

export class UpdateManageChildNotesDto extends PartialType(
  CreateManageChildNotesDto,
) {}
