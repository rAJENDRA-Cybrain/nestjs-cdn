import { Test, TestingModule } from '@nestjs/testing';
import { RecordConversationService } from './record-conversation.service';

describe('RecordConversationService', () => {
  let service: RecordConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordConversationService],
    }).compile();

    service = module.get<RecordConversationService>(RecordConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
