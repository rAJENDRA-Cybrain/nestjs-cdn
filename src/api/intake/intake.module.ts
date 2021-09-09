import { forwardRef, Module } from '@nestjs/common';
import { IntakeService } from './intake.service';
import { IntakeController } from './intake.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCoordinatorService } from '../service-coordinator/service-coordinator.service';
import { AuthModule } from 'src/api/auth/auth.module';
import {
  UserEntity,
  IntakeEntity,
  ServiceCoordinatorEntity,
} from 'src/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      IntakeEntity,
      ServiceCoordinatorEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [IntakeController],
  providers: [IntakeService, ServiceCoordinatorService],
})
export class IntakeModule {}
