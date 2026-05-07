import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConfigifyModule } from '@itgorillaz/configify';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { RabbitMQHealthIndicator } from './health/rabbitmq.health';

@Module({
  imports: [ConfigifyModule.forRootAsync(), TerminusModule],
  controllers: [HealthController],
  providers: [ConsumerService, RabbitMQHealthIndicator],
})
export class ConsumerModule {}