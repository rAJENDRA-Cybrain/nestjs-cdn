import { Injectable } from '@nestjs/common';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from '../../dto';

@Injectable()
export class EmailTemplateService {
  create(createEmailTemplateDto: CreateEmailTemplateDto) {
    return 'This action adds a new emailTemplate';
  }

  findAll() {
    return `This action returns all emailTemplate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emailTemplate`;
  }

  update(id: number, updateEmailTemplateDto: UpdateEmailTemplateDto) {
    return `This action updates a #${id} emailTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} emailTemplate`;
  }
}
