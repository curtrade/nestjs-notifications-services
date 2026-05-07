import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckError } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { ConsumerService } from '../consumer.service';

describe('RabbitMQHealthIndicator', () => {
  let indicator: RabbitMQHealthIndicator;
  let consumerService: jest.Mocked<Pick<ConsumerService, 'isConnected'>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQHealthIndicator,
        {
          provide: ConsumerService,
          useValue: { isConnected: jest.fn() },
        },
      ],
    }).compile();

    indicator = module.get<RabbitMQHealthIndicator>(RabbitMQHealthIndicator);
    consumerService = module.get(ConsumerService);
  });

  it('should return healthy result when RabbitMQ is connected', async () => {
    (consumerService.isConnected as jest.Mock).mockReturnValue(true);

    const result = await indicator.isHealthy('rabbitmq');

    expect(result).toEqual({ rabbitmq: { status: 'up' } });
  });

  it('should throw HealthCheckError when RabbitMQ is not connected', async () => {
    (consumerService.isConnected as jest.Mock).mockReturnValue(false);

    await expect(indicator.isHealthy('rabbitmq')).rejects.toThrow(HealthCheckError);
  });
});
