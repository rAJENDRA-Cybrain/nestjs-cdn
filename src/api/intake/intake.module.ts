import { forwardRef, Module } from '@nestjs/common';
import { IntakeService } from './intake.service';
import { IntakeController } from './intake.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCoordinatorService } from '../service-coordinator/service-coordinator.service';
import { AuthModule } from 'src/api/auth/auth.module';
import { SmtpDetailsService } from '../smtp-details/smtp-details.service';
import {
  UserEntity,
  IntakeEntity,
  ServiceCoordinatorEntity,
  AdditionalChildrenEntity,
  SmtpDetailEntity,
  AgencyEntity,
  NotificationEntity,
} from 'src/database';
import { AgencyService } from '../agency/agency.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      IntakeEntity,
      SmtpDetailEntity,
      AdditionalChildrenEntity,
      ServiceCoordinatorEntity,
      AgencyEntity,
      NotificationEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [IntakeController],
  providers: [
    IntakeService,
    ServiceCoordinatorService,
    AgencyService,
    SmtpDetailsService,
    NotificationService,
  ],
})
export class IntakeModule {}
