import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmtpDetailEntity } from '../../database';
import { CreateSmtpDetailDto, UpdateSmtpDetailDto } from '../../dto';
@Injectable()
export class SmtpDetailsService {
  constructor(
    @InjectRepository(SmtpDetailEntity)
    private smtpRepository: Repository<SmtpDetailEntity>,
  ) {}

  async isSmtpDetailsExist(
    data: CreateSmtpDetailDto,
  ): Promise<SmtpDetailEntity> {
    return await this.smtpRepository.findOne({
      smtpDisplayName: data.smtpDisplayName,
      smtpUserName: data.smtpUserName,
      smtpPort: data.smtpPort,
      smtpHost: data.smtpHost,
      smtpSsl: data.smtpSsl,
      isDelete: false,
    });
  }

  public async save(createSmtpDetailDto: CreateSmtpDetailDto) {
    return await this.smtpRepository.save(createSmtpDetailDto);
  }

  public async findAll(): Promise<SmtpDetailEntity[]> {
    return await this.smtpRepository.find({
      where: {
        isDelete: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async isSmtpDetailsExistById(id: string): Promise<SmtpDetailEntity> {
    return await this.smtpRepository.findOne({ smtpId: id });
  }

  public async update(id: string, updateSmtpDetailDto: UpdateSmtpDetailDto) {
    return await this.smtpRepository.update(id, updateSmtpDetailDto);
  }

  public async findActiveSmtp(): Promise<SmtpDetailEntity> {
    return await this.smtpRepository.findOne({
      where: {
        isActive: true,
        isDelete: false,
      },
      order: { createdAt: 'ASC' },
    });
  }

  public async updateStatus(id: string, isActive: boolean, isDelete: boolean) {
    return await this.smtpRepository.update(id, {
      isActive: isActive,
      isDelete: isDelete,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} smtpDetail`;
  }
}
