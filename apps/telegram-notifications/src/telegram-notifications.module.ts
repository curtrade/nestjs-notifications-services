import { Module } from '@nestjs/common';
import { ConfigifyModule } from '@itgorillaz/configify';
import { TelegramNotificationsController } from './telegram-notifications.controller';
import { TelegramNotificationsService } from './telegram-notifications.service';

@Module({
  imports:[ConfigifyModule.forRootAsync()],
  controllers: [TelegramNotificationsController],
  providers: [TelegramNotificationsService],
})
export class TelegramNotificationsModule {}
