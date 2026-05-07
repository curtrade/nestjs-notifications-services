import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { ConsumerService } from '../consumer.service';

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  constructor(private readonly consumerService: ConsumerService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const connected = this.consumerService.isConnected();
    const result = this.getStatus(key, connected);

    if (!connected) {
      throw new HealthCheckError('RabbitMQ connection is down', result);
    }

    return result;
  }
}