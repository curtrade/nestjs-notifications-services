import { Configuration, Value } from '@itgorillaz/configify'
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class RabbitMQConfiguration {
    @IsNotEmpty()
    @Value('RABBITMQ_URL')
    url: string = ""; 

    @IsNotEmpty()
    @Value('QUEUE')
    queue: string = ""; 

    @Value('RETRIES', { parse: parseInt })
    retries: number = 3;

    
    @Value('ATTEMPT_DELAY_MULTIPLICATOR', { parse: parseInt })
    attemptDelayMultiplicator: number = 1000;
}