import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelegramConfiguration } from './config/telegram.configuration';
import { SendNotificationDto } from './dto/send-notification.dto';
import { TELEGRAM_MESSAGES, TELEGRAM_PARSE_MODES } from './constants/messages';

interface TelegramMessagePayload {
  chat_id: number;
  text: string;
  parse_mode?: typeof TELEGRAM_PARSE_MODES;
}

interface TelegramApiResponse {
  ok: boolean;
  result?: { message_id: number };
  description?: string;
}

@Injectable()
export class TelegramNotificationsService {

  constructor(private readonly telegramConfig: TelegramConfiguration) {}

  async sendNotification(dto: SendNotificationDto): Promise<{ success: boolean; message: string; messageId?: number }> {
    const chatId = dto.chatId;

    try {
      const response = await this.sendTelegramMessage({
        chat_id: chatId,
        text: dto.message,
        parse_mode: dto.parseMode,
      });

      return {
        success: true,
        message: TELEGRAM_MESSAGES.NOTIFICATION_SENT_SUCCESS,
        messageId: response.result?.message_id,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: TELEGRAM_MESSAGES.NOTIFICATION_SENT_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async sendTelegramMessage(payload: TelegramMessagePayload): Promise<TelegramApiResponse> {
    const url = `${this.telegramConfig.apiUrl}/bot${this.telegramConfig.apiToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData: TelegramApiResponse = await response.json();
      throw new Error(errorData.description ?? `Telegram API error: ${response.statusText}`);
    }

    return response.json();
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}