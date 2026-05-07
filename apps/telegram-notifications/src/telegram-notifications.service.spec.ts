import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { TelegramNotificationsService } from './telegram-notifications.service';
import { TelegramConfiguration } from './config/telegram.configuration';
import { TELEGRAM_MESSAGES } from './constants/messages';

const mockConfig = {
  apiUrl: 'https://api.telegram.org',
  apiToken: 'test-token-123',
};

describe('TelegramNotificationsService', () => {
  let service: TelegramNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramNotificationsService,
        { provide: TelegramConfiguration, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<TelegramNotificationsService>(TelegramNotificationsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getHealth', () => {
    it('should return status ok with a valid ISO timestamp', () => {
      const result = service.getHealth();

      expect(result.status).toBe('ok');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });

  describe('sendNotification', () => {
    it('should return success when Telegram API responds ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, result: { message_id: 42 } }),
      }) as jest.Mock;

      const result = await service.sendNotification({ message: 'Hello', chatId: 123456 });

      expect(result).toEqual({
        success: true,
        message: TELEGRAM_MESSAGES.NOTIFICATION_SENT_SUCCESS,
        messageId: 42,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockConfig.apiUrl}/bot${mockConfig.apiToken}/sendMessage`,
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('should throw InternalServerErrorException when Telegram API returns non-ok response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ ok: false, description: 'chat not found' }),
      }) as jest.Mock;

      await expect(
        service.sendNotification({ message: 'Hi', chatId: 0 }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when fetch itself throws', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as jest.Mock;

      await expect(
        service.sendNotification({ message: 'Hi', chatId: 1 }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
