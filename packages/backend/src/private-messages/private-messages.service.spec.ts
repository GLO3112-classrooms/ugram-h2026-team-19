import { Test, TestingModule } from '@nestjs/testing';
import { PrivateMessagesService } from './private-messages.service.js';

describe('PostsService', () => {
  let service: PrivateMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateMessagesService],
    }).compile();

    service = module.get<PrivateMessagesService>(PrivateMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
