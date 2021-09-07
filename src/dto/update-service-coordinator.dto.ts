import { PartialType } from '@nestjs/swagger';
import { CreateServiceCoordinatorDto } from './create-service-coordinator.dto';

export class UpdateServiceCoordinatorDto extends PartialType(CreateServiceCoordinatorDto) {}
