import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from '../../dto';
import {
  EmailTemplateEntity,
  EmailTemplateAttachmentsEntity,
} from 'src/database';
@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private emailTemplateRepository: Repository<EmailTemplateEntity>,
    @InjectRepository(EmailTemplateAttachmentsEntity)
    private emailTemplateAttachmentsRepository: Repository<EmailTemplateAttachmentsEntity>,
  ) {}

  async findIsExist(template: CreateEmailTemplateDto) {
    const data: any[] = await this.emailTemplateRepository.find({
      templateTitle: template.templateTitle,
      isActive: true,
    });
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async saveEmailTemplate(template: CreateEmailTemplateDto) {
    return await this.emailTemplateRepository.save({
      templateTitle: template.templateTitle,
      templateSubject: template.templateSubject,
      templateBody: template.templateBody,
    });
  }

  async saveAttachments(req, id, files) {
    const template = await this.emailTemplateRepository.findOne({
      where: { templateId: id },
    });
    for (let i = 0; i < files.length; i++) {
      await this.emailTemplateAttachmentsRepository.save({
        attachmentFileName: files[i].originalname,
        attachmentFileUri:
          req.protocol +
          '://' +
          req.get('host') +
          `/uploads/email-attachments/${files[i].filename}`,
        templates: template,
      });
    }
  }

  async findAllEmailTemplates() {
    return await this.emailTemplateRepository
      .createQueryBuilder('template')
      .innerJoinAndSelect(
        'template.attachments',
        'attachments',
        'attachments.isActive = :isActive',
        { isActive: true },
      )
      .where('template.isActive = :isActive', { isActive: true })
      .orderBy({ 'template.createdAt': 'DESC' })
      .getMany();
  }

  async updateEmailTemplate(id: string, template: UpdateEmailTemplateDto) {
    return await this.emailTemplateRepository.update(id, {
      templateTitle: template.templateTitle,
      templateSubject: template.templateSubject,
      templateBody: template.templateBody,
    });
  }

  async updateEmailAttachment(req, id, files) {
    await this.emailTemplateAttachmentsRepository.delete({
      templates: Equal(id),
    });
    const template = await this.emailTemplateRepository.findOne({
      where: { templateId: id },
    });
    for (let i = 0; i < files.length; i++) {
      await this.emailTemplateAttachmentsRepository.save({
        attachmentFileName: files[i].originalname,
        attachmentFileUri:
          req.protocol +
          '://' +
          req.get('host') +
          `/uploads/email-attachments/${files[i].filename}`,
        templates: template,
      });
    }
  }

  public async isEmailTemplateExistByOtherId(
    id,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
  ): Promise<EmailTemplateEntity> {
    return await this.emailTemplateRepository.findOne({
      isActive: true,
      templateId: Not(id),
      templateTitle: updateEmailTemplateDto.templateTitle,
    });
  }

  async archiveEmailTemplate(id: string) {
    return await this.emailTemplateRepository.update(id, {
      isActive: false,
    });
  }

  async findIndividualEmailTemplate(id: string) {
    return await this.emailTemplateRepository
      .createQueryBuilder('template')
      .innerJoinAndSelect(
        'template.attachments',
        'attachments',
        'attachments.isActive = :isActive',
        { isActive: true },
      )
      .where(
        'template.isActive = :isActive AND template.templateId = :templateId',
        { isActive: true, templateId: id },
      )
      .orderBy({ 'template.createdAt': 'DESC' })
      .getMany();
  }
}
