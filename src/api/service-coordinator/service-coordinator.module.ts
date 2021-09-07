import { forwardRef, Module } from '@nestjs/common';
import { ServiceCoordinatorService } from './service-coordinator.service';
import { ServiceCoordinatorController } from './service-coordinator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCoordinatorEntity } from 'src/database';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCoordinatorEntity])],
  controllers: [ServiceCoordinatorController],
  providers: [ServiceCoordinatorService],
})
export class ServiceCoordinatorModule {}
