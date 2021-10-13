import { Test, TestingModule } from '@nestjs/testing';
import { RecordConversationController } from './record-conversation.controller';
import { RecordConversationService } from './record-conversation.service';

describe('RecordConversationController', () => {
  let controller: RecordConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordConversationController],
      providers: [RecordConversationService],
    }).compile();

    controller = module.get<RecordConversationController>(
      RecordConversationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
