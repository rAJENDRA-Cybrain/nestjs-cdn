import { Module } from '@nestjs/common';
import { ServiceCoordinatorService } from './service-coordinator.service';
import { ServiceCoordinatorController } from './service-coordinator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyEntity, ServiceCoordinatorEntity } from 'src/database';
import { AgencyService } from '../agency/agency.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCoordinatorEntity, AgencyEntity])],
  controllers: [ServiceCoordinatorController],
  providers: [ServiceCoordinatorService, AgencyService],
})
export class ServiceCoordinatorModule {}
