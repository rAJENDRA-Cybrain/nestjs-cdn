import { forwardRef, Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConversationTypeEntity,
  IntakeEntity,
  ManageChildNotesEntity,
  UserEntity,
  ReportsGeneratedEntity,
} from 'src/database';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      IntakeEntity,
      ManageChildNotesEntity,
      ConversationTypeEntity,
      ReportsGeneratedEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
