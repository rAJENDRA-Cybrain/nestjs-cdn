import { PartialType } from '@nestjs/swagger';
import { CreateRecordConversationDto } from './create-record-conversation.dto';

export class UpdateRecordConversationDto extends PartialType(CreateRecordConversationDto) {}
