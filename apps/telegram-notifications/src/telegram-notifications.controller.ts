import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TelegramNotificationsService } from './telegram-notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@ApiTags('Telegram Notifications')
@Controller('notifications')
export class TelegramNotificationsController {
  constructor(private readonly telegramNotificationsService: TelegramNotificationsService) {}

  @ApiOperation({ summary: 'Отправить уведомление в Telegram' })
  @ApiResponse({ status: 200, description: 'Уведомление отправлено', schema: { example: { success: true, message: 'Уведомление успешно отправлено', messageId: 42 } } })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса' })
  @ApiResponse({ status: 500, description: 'Ошибка отправки через Telegram API' })
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto): Promise<{ success: boolean; message: string; messageId?: number }> {
    return this.telegramNotificationsService.sendNotification(dto);
  }

  @ApiOperation({ summary: 'Проверка состояния сервиса' })
  @ApiResponse({ status: 200, description: 'Сервис работает', schema: { example: { status: 'ok', timestamp: '2026-05-07T13:00:00.000Z' } } })
  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth(): { status: string; timestamp: string } {
    return this.telegramNotificationsService.getHealth();
  }
}
