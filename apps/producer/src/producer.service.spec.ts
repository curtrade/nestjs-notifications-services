import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService, EventAction } from './producer.service';
import { RabbitMQConfiguration } from './config/rabbitmq.configuration';

jest.mock('uuid', () => ({ v4: jest.fn() }));
jest.mock('amqplib', () => ({ connect: jest.fn() }));

import { connect } from 'amqplib';

const ENTITY_UUID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const MESSAGE_UUID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

const mockChannel = {
  assertQueue: jest.fn().mockResolvedValue({}),
  sendToQueue: jest.fn().mockReturnValue(true),
  waitForConfirms: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
};

const mockConnection = {
  createConfirmChannel: jest.fn().mockResolvedValue(mockChannel),
  close: jest.fn().mockResolvedValue(undefined),
};

const mockConfig = {
  url: 'amqp://guest:guest@localhost:5672',
  queue: 'events_queue',
  retries: 3,
  attemptDelayMultiplicator: 100,
};

describe('ProducerService', () => {
  let service: ProducerService;
  let uuidv4: jest.Mock;

  beforeEach(async () => {
    (connect as jest.Mock).mockResolvedValue(mockConnection);
    uuidv4 = jest.requireMock('uuid').v4;
    uuidv4.mockReturnValueOnce(ENTITY_UUID).mockReturnValue(MESSAGE_UUID);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        { provide: RabbitMQConfiguration, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should return entity with uuid id and matching dto fields', async () => {
      uuidv4.mockReturnValueOnce(ENTITY_UUID).mockReturnValue(MESSAGE_UUID);

      const dto = { event: 'user.registered', comment: 'new sign-up' };
      const entity = await service.createEvent(dto);

      expect(entity.id).toBe(ENTITY_UUID);
      expect(entity.event).toBe(dto.event);
      expect(entity.comment).toBe(dto.comment);
    });

    it('should send a persistent message with Create action to the configured queue', async () => {
      uuidv4.mockReturnValueOnce(ENTITY_UUID).mockReturnValue(MESSAGE_UUID);

      const dto = { event: 'order.created' };
      const entity = await service.createEvent(dto);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        mockConfig.queue,
        expect.any(Buffer),
        { persistent: true },
      );

      const sentPayload = JSON.parse(
        (mockChannel.sendToQueue.mock.calls[0][1] as Buffer).toString(),
      );
      expect(sentPayload.action).toBe(EventAction.Create);
      expect(sentPayload.data.id).toBe(entity.id);
      expect(sentPayload.data.event).toBe(dto.event);
    });
  });
});
