import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TelegramNotificationsService } from './telegram-notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
export class TelegramNotificationsController {
  constructor(private readonly telegramNotificationsService: TelegramNotificationsService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto): Promise<{ success: boolean; message: string; messageId?: number }> {
    return this.telegramNotificationsService.sendNotification(dto);
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth(): { status: string; timestamp: string } {
    return this.telegramNotificationsService.getHealth();
  }
}
