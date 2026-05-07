import { Configuration, Value } from '@itgorillaz/configify';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@Configuration()
export class RabbitMQConfiguration {
  @IsNotEmpty()
  @Value('RABBITMQ_URL')
  url!: string;

  @IsNotEmpty()
  @Value('QUEUE')
  queue!: string;

  @IsInt()
  @Min(1)
  @Value('RETRIES', { parse: parseInt })
  retries: number = 3;

  @IsInt()
  @Min(0)
  @Value('ATTEMPT_DELAY_MULTIPLICATOR', { parse: parseInt })
  attemptDelayMultiplicator: number = 1000;
}