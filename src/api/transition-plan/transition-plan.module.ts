import { forwardRef, Module } from '@nestjs/common';
import { TransitionPlanService } from './transition-plan.service';
import { TransitionPlanController } from './transition-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity, IntakeEntity } from 'src/database';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, IntakeEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TransitionPlanController],
  providers: [TransitionPlanService],
})
export class TransitionPlanModule {}
