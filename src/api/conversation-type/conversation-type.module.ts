import { Module } from '@nestjs/common';
import { ConversationTypeService } from './conversation-type.service';
import { ConversationTypeController } from './conversation-type.controller';
import { ConversationTypeEntity } from 'src/database/entities/conversation-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationTypeEntity])],
  controllers: [ConversationTypeController],
  providers: [ConversationTypeService],
})
export class ConversationTypeModule {}
