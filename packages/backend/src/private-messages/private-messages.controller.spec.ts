import { Test, TestingModule } from '@nestjs/testing';
import { PrivateMessagesController } from './private-messages.controller.js';

describe('PostsController', () => {
  let controller: PrivateMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateMessagesController],
    }).compile();

    controller = module.get<PrivateMessagesController>(
      PrivateMessagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
