import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './entities/event.entity';

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }

  @Post('events')
  async create(@Body() dto: CreateEventDto): Promise<EventEntity> {
     return this.producerService.createEvent(dto);
  }
}