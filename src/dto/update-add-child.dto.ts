import { PartialType } from '@nestjs/swagger';
import { CreateAdditionalChildrenDto } from './create-add-child.dto';

export class UpdateAdditionalChildrenDto extends PartialType(
  CreateAdditionalChildrenDto,
) {}
