import { forwardRef, Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyEntity, UserEntity } from 'src/database';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgencyEntity, UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
