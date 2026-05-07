import { Test, TestingModule } from '@nestjs/testing';
import { TelegramNotificationsController } from './telegram-notifications.controller';
import { TelegramNotificationsService } from './telegram-notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

describe('TelegramNotificationsController', () => {
  let controller: TelegramNotificationsController;
  let service: jest.Mocked<TelegramNotificationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelegramNotificationsController],
      providers: [
        {
          provide: TelegramNotificationsService,
          useValue: {
            sendNotification: jest.fn(),
            getHealth: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TelegramNotificationsController>(TelegramNotificationsController);
    service = module.get(TelegramNotificationsService);
  });

  describe('getHealth', () => {
    it('should return health status from service', () => {
      const result = { status: 'ok', timestamp: '2024-01-01T00:00:00.000Z' };
      service.getHealth.mockReturnValue(result);

      expect(controller.getHealth()).toBe(result);
      expect(service.getHealth).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendNotification', () => {
    it('should delegate to service and return result', async () => {
      const dto: SendNotificationDto = { message: 'test message', chatId: '123456' };
      const result = { success: true, message: 'Уведомление успешно отправлено', messageId: 42 };
      service.sendNotification.mockResolvedValue(result);

      expect(await controller.sendNotification(dto)).toBe(result);
      expect(service.sendNotification).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors', async () => {
      const dto: SendNotificationDto = { message: 'test' };
      service.sendNotification.mockRejectedValue(new Error('Telegram API error'));

      await expect(controller.sendNotification(dto)).rejects.toThrow('Telegram API error');
    });
  });
});