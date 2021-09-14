import { forwardRef, Module } from '@nestjs/common';
import { RecordConversationService } from './record-conversation.service';
import { RecordConversationController } from './record-conversation.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConversationTypeEntity,
  RecordConversationEntity,
  UserEntity,
} from 'src/database';
import { ConversationTypeService } from '../conversation-type/conversation-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RecordConversationEntity,
      ConversationTypeEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RecordConversationController],
  providers: [RecordConversationService, ConversationTypeService],
})
export class RecordConversationModule {}
