import { PartialType } from '@nestjs/swagger';
import { CreateManageChildDto } from './create-manage-child.dto';

export class UpdateManageChildDto extends PartialType(CreateManageChildDto) {}
