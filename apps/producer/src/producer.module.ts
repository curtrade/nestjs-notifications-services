import { Module } from '@nestjs/common';
import { ConfigifyModule } from '@itgorillaz/configify'
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports:[ConfigifyModule.forRootAsync()],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}