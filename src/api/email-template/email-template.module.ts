import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailTemplateAttachmentsEntity,
  EmailTemplateEntity,
} from 'src/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailTemplateEntity,
      EmailTemplateAttachmentsEntity,
    ]),
  ],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
})
export class EmailTemplateModule {}
