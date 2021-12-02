import { forwardRef, Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgencyEntity,
  UserEntity,
  ServiceCoordinatorEntity,
  AdditionalChildrenEntity,
  IntakeEntity,
} from 'src/database';
import { AuthModule } from '../auth/auth.module';
import { ServiceCoordinatorService } from '../service-coordinator/service-coordinator.service';
import { IntakeService } from '../intake/intake.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgencyEntity,
      UserEntity,
      ServiceCoordinatorEntity,
      AdditionalChildrenEntity,
      IntakeEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AgencyController],
  providers: [AgencyService, ServiceCoordinatorService, IntakeService],
})
export class AgencyModule {}
