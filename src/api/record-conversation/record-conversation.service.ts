import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  CreateRecordConversationDto,
  UpdateRecordConversationDto,
} from '../../dto';
import {
  RecordConversationEntity,
  ConversationTypeEntity,
} from '../../database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationTypeService } from '../conversation-type/conversation-type.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RecordConversationService {
  constructor(
    @InjectRepository(RecordConversationEntity)
    private recordConvRepository: Repository<RecordConversationEntity>,
    @InjectRepository(ConversationTypeEntity)
    private convTypeRepository: Repository<ConversationTypeEntity>,
    private readonly conversationTypeService: ConversationTypeService,
    private authService: AuthService,
  ) {}

  public async saveConversation(userId, data: CreateRecordConversationDto) {
    return this.recordConvRepository.save({
      conversationDate: data.conversationDate,
      conversationTimestamp: data.conversationTimestamp,
      conversationDescriptions: data.conversationDescriptions,
      conversationType: await this.conversationTypeService.findById(
        data.conversationTypeId,
      ),
      conversationAddedBy: await this.authService.isUserExistById(userId),
    });
  }

  public async findRecoddedConversations(): Promise<
    RecordConversationEntity[]
  > {
    return await this.recordConvRepository
      .createQueryBuilder('Record')
      .select([
        'Record',
        'conversationType.conversationTypeId',
        'conversationType.type',
        'conversationType.description',
        'conversationAddedBy.userId',
        'conversationAddedBy.firstName',
        'conversationAddedBy.lastName',
        'conversationAddedBy.emailId',
        'conversationAddedBy.contactNo',
      ])
      .leftJoin('Record.conversationType', 'conversationType')
      .leftJoin('Record.conversationAddedBy', 'conversationAddedBy')
      .where({ isActive: true })
      .orderBy({ 'Record.createdAt': 'DESC' })
      .getMany();
  }

  public async updateConversation(
    conversationId,
    data: UpdateRecordConversationDto,
  ) {
    return this.recordConvRepository.update(conversationId, {
      conversationDate: data.conversationDate,
      conversationTimestamp: data.conversationTimestamp,
      conversationDescriptions: data.conversationDescriptions,
      conversationType: await this.conversationTypeService.findById(
        data.conversationTypeId,
      ),
    });
  }

  async deleteConversation(id: string) {
    return this.recordConvRepository.update(id, {
      isActive: false,
    });
  }
}
