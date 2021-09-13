import { Module } from '@nestjs/common';
import { SmtpDetailsService } from './smtp-details.service';
import { SmtpDetailsController } from './smtp-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmtpDetailEntity } from 'src/database';

@Module({
  imports: [TypeOrmModule.forFeature([SmtpDetailEntity])],
  controllers: [SmtpDetailsController],
  providers: [SmtpDetailsService],
})
export class SmtpDetailsModule {}
