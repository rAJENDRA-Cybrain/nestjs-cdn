import { Module } from '@nestjs/common';
import { RecordConversationService } from './record-conversation.service';
import { RecordConversationController } from './record-conversation.controller';

@Module({
  controllers: [RecordConversationController],
  providers: [RecordConversationService]
})
export class RecordConversationModule {}
