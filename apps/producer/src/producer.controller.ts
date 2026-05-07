import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProducerService } from './producer.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './entities/event.entity';

@ApiTags('Producer')
@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @ApiOperation({ summary: 'Проверка состояния сервиса' })
  @ApiResponse({ status: 200, description: 'Сервис работает', schema: { example: { status: 'ok' } } })
  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }

  @ApiOperation({ summary: 'Создать событие и опубликовать в RabbitMQ' })
  @ApiResponse({ status: 201, description: 'Событие создано и отправлено в очередь', schema: { example: { id: 'uuid-v4', event: 'user.registered', comment: 'комментарий' } } })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса' })
  @Post('events')
  async create(@Body() dto: CreateEventDto): Promise<EventEntity> {
     return this.producerService.createEvent(dto);
  }
}