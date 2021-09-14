import { Injectable } from '@nestjs/common';
import { CreateRecordConversationDto } from './dto/create-record-conversation.dto';
import { UpdateRecordConversationDto } from './dto/update-record-conversation.dto';

@Injectable()
export class RecordConversationService {
  create(createRecordConversationDto: CreateRecordConversationDto) {
    return 'This action adds a new recordConversation';
  }

  findAll() {
    return `This action returns all recordConversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recordConversation`;
  }

  update(id: number, updateRecordConversationDto: UpdateRecordConversationDto) {
    return `This action updates a #${id} recordConversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordConversation`;
  }
}
