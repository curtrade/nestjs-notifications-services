import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';

@ApiTags('Consumer Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly rabbitMQHealth: RabbitMQHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'Проверка состояния consumer и подключения к RabbitMQ' })
  @ApiResponse({ status: 200, description: 'Все зависимости в норме', schema: { example: { status: 'ok', info: { rabbitmq: { status: 'up' } }, error: {}, details: { rabbitmq: { status: 'up' } } } } })
  @ApiResponse({ status: 503, description: 'Одна или более зависимостей недоступны' })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.rabbitMQHealth.isHealthy('rabbitmq'),
    ]);
  }
}