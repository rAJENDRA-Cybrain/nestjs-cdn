import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationTypeEntity } from '../../database';
import { CreateConversationTypeDto } from '../../dto';
@Injectable()
export class ConversationTypeService {
  constructor(
    @InjectRepository(ConversationTypeEntity)
    private convTypeRepository: Repository<ConversationTypeEntity>,
  ) {}

  public async save(createConversationTypeDto: CreateConversationTypeDto) {
    return await this.convTypeRepository.save(createConversationTypeDto);
  }

  public async findAll(): Promise<ConversationTypeEntity[]> {
    return await this.convTypeRepository.find();
  }

  public async findById(id): Promise<ConversationTypeEntity> {
    return await this.convTypeRepository.findOne({
      conversationTypeId: id,
      isActive: true,
    });
  }
}
