import { forwardRef, Module } from '@nestjs/common';
import { ExitPlanService } from './exit-plan.service';
import { ExitPlanController } from './exit-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserEntity, IntakeEntity } from 'src/database';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, IntakeEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ExitPlanController],
  providers: [ExitPlanService],
})
export class ExitPlanModule {}
