import { PartialType } from '@nestjs/swagger';
import { CreateExitPlanDto } from './create-exit-plan.dto';

export class UpdateExitPlanDto extends PartialType(CreateExitPlanDto) {}
